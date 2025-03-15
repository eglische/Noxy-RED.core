using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;
using Voxta.Providers.Host;

public class ApplicationProvider : ProviderBase, IAsyncDisposable
{
    private readonly IMqttClient _mqttClient;
    private readonly ILogger<ApplicationProvider> _logger;
    private readonly IConfiguration _configuration;
    private readonly string _applicationTopic;
    private readonly string _brokerAddress;
    private readonly int _port;
    private readonly MqttQualityOfServiceLevel _mqttQoS;
    private readonly CancellationTokenSource _cancellationTokenSource = new();
    private bool _disposed = false;

    public ApplicationProvider(ILogger<ApplicationProvider> logger, IConfiguration configuration)
        : base(null, logger)
    {
        _logger = logger;
        _configuration = configuration;

        var mqttOptions = _configuration.GetSection("MQTT").Get<MqttOptions>();
        if (mqttOptions == null || string.IsNullOrEmpty(mqttOptions.BrokerAddress))
        {
            throw new ArgumentNullException(nameof(mqttOptions.BrokerAddress), "BrokerAddress is missing in the configuration.");
        }

        _brokerAddress = mqttOptions.BrokerAddress;
        _port = mqttOptions.Port == 0 ? 1883 : mqttOptions.Port;
        _mqttQoS = (MqttQualityOfServiceLevel)Enum.ToObject(typeof(MqttQualityOfServiceLevel), mqttOptions.QoS);
        _applicationTopic = mqttOptions.ApplicationTopic ?? "/noxyred/app";

        _mqttClient = new MqttFactory().CreateMqttClient();

        _logger.LogInformation("ApplicationProvider initialized with BrokerAddress: {BrokerAddress}, Port: {Port}, ApplicationTopic: {ApplicationTopic}, and QoS: {QoS}",
            _brokerAddress, _port, _applicationTopic, _mqttQoS);
    }

    protected override async Task OnStartAsync()
    {
        await base.OnStartAsync();
        await RetryWithBackoffAsync(ConnectAndSubscribeAsync, _cancellationTokenSource.Token);
    }

    private async Task ConnectAndSubscribeAsync()
    {
        var options = new MqttClientOptionsBuilder()
            .WithTcpServer(_brokerAddress, _port)
            .WithCleanSession()
            .Build();

        _logger.LogInformation("Connecting to MQTT broker at {BrokerAddress}:{Port}", _brokerAddress, _port);
        var response = await _mqttClient.ConnectAsync(options, _cancellationTokenSource.Token);
        if (response.ResultCode != MqttClientConnectResultCode.Success)
        {
            _logger.LogError("Failed to connect to MQTT broker with result: {Result}", response.ResultCode);
            return;
        }
        _logger.LogInformation("Connected to MQTT broker.");

        _mqttClient.ApplicationMessageReceivedAsync += HandleApplicationMessage;
        await _mqttClient.SubscribeAsync(_applicationTopic, _mqttQoS);
        _logger.LogInformation("Subscribed to MQTT topic: {ApplicationTopic}", _applicationTopic);
    }

    private async Task HandleApplicationMessage(MqttApplicationMessageReceivedEventArgs args)
    {
        _logger.LogInformation("MQTT message received on topic: {Topic}", args.ApplicationMessage.Topic);

        if (args.ApplicationMessage.Topic != _applicationTopic)
        {
            _logger.LogWarning("Ignoring message from different topic: {Topic}", args.ApplicationMessage.Topic);
            return;
        }

        try
        {
            if (args.ApplicationMessage.Payload == null || args.ApplicationMessage.Payload.Length == 0)
            {
                _logger.LogWarning("Received empty MQTT message.");
                return;
            }

            var payload = Encoding.UTF8.GetString(args.ApplicationMessage.Payload);
            _logger.LogInformation("Raw payload received: {Payload}", payload);

            var request = JsonSerializer.Deserialize<AppRequest>(payload);
            if (request == null)
            {
                _logger.LogWarning("Failed to deserialize MQTT message payload.");
                return;
            }

            _logger.LogInformation("Parsed request - Type: {RequestType}, Value: {RequestValue}", request.Type, request.Value);

            if (request.Type == "web")
            {
                OpenWebsite(request.Value);
            }
            else if (request.Type == "app")
            {
                StartApplication(request.Value);
            }
            else
            {
                _logger.LogWarning("Unknown request type received: {RequestType}", request.Type);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing application request");
        }
    }

    private void OpenWebsite(string url)
    {
        try
        {
            if (!Uri.IsWellFormedUriString(url, UriKind.Absolute))
            {
                _logger.LogWarning("Invalid URL received: {Url}", url);
                return;
            }

            Process.Start(new ProcessStartInfo
            {
                FileName = url,
                UseShellExecute = true
            });

            _logger.LogInformation("Successfully opened website: {Url}", url);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to open website: {Url}", url);
        }
    }

    private void StartApplication(string appPath)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(appPath) || !File.Exists(appPath))
            {
                _logger.LogWarning("Invalid application path received: {AppPath}", appPath);
                return;
            }

            Process.Start(new ProcessStartInfo
            {
                FileName = appPath,
                UseShellExecute = true,
                Verb = "open"
            });

            _logger.LogInformation("Successfully launched application: {AppPath}", appPath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to start application: {AppPath}", appPath);
        }
    }

    private async Task RetryWithBackoffAsync(Func<Task> action, CancellationToken cancellationToken)
    {
        const int maxRetries = 5;
        int retryCount = 0;
        const int initialDelaySeconds = 2;
        const int maxDelaySeconds = 60;

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                await action();
                return;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to connect to MQTT broker. Retrying...");

                if (++retryCount > maxRetries)
                {
                    _logger.LogCritical("Maximum retry attempts reached. Shutting down connection.");
                    throw;
                }

                int delay = Math.Min(initialDelaySeconds * (int)Math.Pow(2, retryCount), maxDelaySeconds);
                _logger.LogWarning("Retrying MQTT connection in {Delay} seconds (attempt {RetryCount}/{MaxRetries})...", delay, retryCount, maxRetries);
                await Task.Delay(TimeSpan.FromSeconds(delay), cancellationToken);
            }
        }
    }
    public class AppRequest
    {
        public string Type { get; set; } // Expected values: "web", "app"
        public string Value { get; set; } // URL or application path
    }
    public class MqttOptions
    {
        public string BrokerAddress { get; set; }
        public int Port { get; set; } = 1883; // Default MQTT port
        public int QoS { get; set; } = 1; // Default QoS level
        public string ApplicationTopic { get; set; } = "/noxyred/app";
    }
}
