using System;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using Voxta.Providers.Host;

namespace Voxta.SampleProviderApp.Providers
{
    public class InterfaceProvider : ProviderBase, IAsyncDisposable
    {
        private readonly IMqttClient _mqttClient;
        private readonly string _keyboardTopic;
        private readonly string _keystrokesTopic;
        private readonly bool _sendKeystrokes;
        private readonly ILogger<InterfaceProvider> _logger;
        private readonly string _brokerAddress;
        private readonly int _port;
        private readonly MqttQualityOfServiceLevel _mqttQoS;
        private readonly CancellationTokenSource _cancellationTokenSource = new();
        private bool _disposed = false;

        public class MqttOptions
        {
            public string BrokerAddress { get; set; }
            public int Port { get; set; }
            public string KeyboardTopic { get; set; }
            public string KeystrokesTopic { get; set; }
            public int QoS { get; set; }
        }

        [DllImport("user32.dll", SetLastError = true)]
        private static extern void keybd_event(byte bVk, byte bScan, int dwFlags, int dwExtraInfo);

        private void SendKeyDown(int vkCode)
        {
            _logger.LogDebug("Sending key down: {VkCode}", vkCode);
            keybd_event((byte)vkCode, 0, 0, 0);
        }

        private void SendKeyUp(int vkCode)
        {
            _logger.LogDebug("Sending key up: {VkCode}", vkCode);
            keybd_event((byte)vkCode, 0, 2, 0);
        }

        private void SimulateKeystroke(List<int> vkSequence)
        {
            _logger.LogInformation("Simulating keystroke sequence: {VkSequence}", vkSequence);
            foreach (int vkCode in vkSequence)
            {
                SendKeyDown(vkCode);
            }

            foreach (int vkCode in vkSequence)
            {
                SendKeyUp(vkCode);
            }
        }

        public InterfaceProvider(
            IRemoteChatSession session,
            ILogger<InterfaceProvider> logger,
            IConfiguration configuration
        ) : base(session, logger)
        {
            _logger = logger;
            var mqttOptions = configuration.GetSection("MQTT").Get<MqttOptions>();
            _mqttClient = new MqttFactory().CreateMqttClient();
            _keyboardTopic = mqttOptions.KeyboardTopic ?? "/noxyred/keyboard/";
            _keystrokesTopic = mqttOptions.KeystrokesTopic ?? "/noxyred/keystrokes/";
            _brokerAddress = mqttOptions.BrokerAddress;
            _port = mqttOptions.Port;
            _mqttQoS = (MqttQualityOfServiceLevel)Enum.ToObject(typeof(MqttQualityOfServiceLevel), mqttOptions.QoS);
            _sendKeystrokes = false;

            _logger.LogInformation("InterfaceProvider initialized with BrokerAddress: {BrokerAddress}, Port: {Port}, KeyboardTopic: {KeyboardTopic}, and QoS: {QoS}",
                _brokerAddress, _port, _keyboardTopic, _mqttQoS);
        }

        protected override async Task OnStartAsync()
        {
            await base.OnStartAsync();
            await RetryWithBackoffAsync(ConnectAndSubscribeAsync, _cancellationTokenSource.Token);
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
                    _logger.LogDebug("Attempting to connect to MQTT broker. Attempt {RetryCount}", retryCount + 1);
                    await action();
                    _logger.LogDebug("Successfully connected to MQTT broker on attempt {RetryCount}", retryCount + 1);
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

        private async Task OnMqttMessageReceivedAsync(MqttApplicationMessageReceivedEventArgs e)
        {
            _logger.LogInformation("Received MQTT message on topic {Topic}: {Payload}",
                e.ApplicationMessage.Topic, Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment));

            string payload = Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment)
                                .Trim('[', ']'); // Remove brackets

            _logger.LogDebug("Processing keyboard command: {Payload}", payload);

            // Extract VK codes (supporting multiple keys)
            List<int> vkCodes = ParseVkCodes(payload);

            if (vkCodes.Count == 0)
            {
                _logger.LogWarning("Invalid keystroke payload: {Payload}", payload);
                return;
            }

            _logger.LogInformation("Simulating keystroke sequence: {VkSequence}", vkCodes);

            if (vkCodes.Count == 1)
            {
                // If single key, press and release with a short delay
                int vkCode = vkCodes[0];
                SendKeyDown(vkCode);
                await Task.Delay(100); // Small delay to mimic real key press
                SendKeyUp(vkCode);
            }
            else
            {
                // If multiple keys, press all keys down, then release in reverse order
                foreach (int vkCode in vkCodes)
                {
                    SendKeyDown(vkCode);
                    await Task.Delay(50); // Small delay to mimic natural key press sequence
                }

                await Task.Delay(200); // Hold the keys for a short time

                foreach (int vkCode in vkCodes.AsEnumerable().Reverse()) // Release in reverse order
                {
                    SendKeyUp(vkCode);
                    await Task.Delay(50);
                }
            }
        }

        private List<int> ParseVkCodes(string payload)
        {
            List<int> vkCodes = new();
            string[] parts = payload.Split(',');

            foreach (string part in parts)
            {
                string trimmed = part.Trim();
                if (trimmed.StartsWith("0x", StringComparison.OrdinalIgnoreCase))
                {
                    // Convert hexadecimal to integer
                    if (int.TryParse(trimmed.Substring(2), System.Globalization.NumberStyles.HexNumber, null, out int vkCode))
                    {
                        vkCodes.Add(vkCode);
                    }
                    else
                    {
                        _logger.LogWarning("Failed to parse hex VK code: {HexCode}", trimmed);
                    }
                }
                else if (int.TryParse(trimmed, out int vkCode)) // If decimal value is sent instead of hex
                {
                    vkCodes.Add(vkCode);
                }
                else
                {
                    _logger.LogWarning("Unrecognized VK format: {Payload}", trimmed);
                }
            }

            return vkCodes;
        }


        private async Task ConnectAndSubscribeAsync()
        {
            _logger.LogDebug("Building MQTT connection options for {BrokerAddress}:{Port}", _brokerAddress, _port);
            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(_brokerAddress, _port)
                .WithCleanSession()
                .Build();

            _logger.LogInformation("Connecting to MQTT broker at {BrokerAddress}:{Port}", _brokerAddress, _port);
            await _mqttClient.ConnectAsync(options, _cancellationTokenSource.Token);
            _logger.LogInformation("Connected to MQTT broker.");

            _logger.LogDebug("Subscribing to topic: {KeyboardTopic} with QoS {QoS}", _keyboardTopic, _mqttQoS);
            await _mqttClient.SubscribeAsync(new MqttTopicFilterBuilder().WithTopic(_keyboardTopic).WithQualityOfServiceLevel(_mqttQoS).Build());
            _logger.LogInformation("Subscribed to MQTT topic: {KeyboardTopic}", _keyboardTopic);

            _mqttClient.ApplicationMessageReceivedAsync += async e => await OnMqttMessageReceivedAsync(e);
        }
    }
}
