using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Voxta.Model.Shared;
using Voxta.Model.WebsocketMessages.ClientMessages;
using Voxta.Model.WebsocketMessages.ServerMessages;
using Voxta.Providers.Host;

namespace Voxta.SampleProviderApp.Providers
{
    public class ActionProvider : ProviderBase, IAsyncDisposable
    {
        private readonly IMqttClient _mqttClient;
        private readonly string _triggerTopic;
        private readonly string _actionTopic;
        private readonly MqttQualityOfServiceLevel _mqttQoS;
        private readonly ILogger<ActionProvider> _logger;
        private readonly string _brokerAddress;
        private readonly int _port;

        private readonly ConcurrentDictionary<string, ScenarioActionDefinition> _registeredActions = new();
        private readonly CancellationTokenSource _cancellationTokenSource = new();
        private bool _disposed = false;

        public ActionProvider(
            IRemoteChatSession session,
            ILogger<ActionProvider> logger,
            IConfiguration configuration
        ) : base(session, logger)
        {
            _logger = logger;
            var mqttOptions = configuration.GetSection("MQTT").Get<ActionMqttOptions>();
            _mqttClient = new MqttFactory().CreateMqttClient();
            _triggerTopic = mqttOptions.TriggerTopic;
            _actionTopic = mqttOptions.ActionTopic;
            _brokerAddress = mqttOptions.BrokerAddress;
            _port = mqttOptions.Port;
            _mqttQoS = (MqttQualityOfServiceLevel)Enum.ToObject(typeof(MqttQualityOfServiceLevel), mqttOptions.QoS);

            _logger.LogInformation("ActionProvider initialized with BrokerAddress: {BrokerAddress}, Port: {Port}, TriggerTopic: {TriggerTopic}, ActionTopic: {ActionTopic}, and QoS: {QoS}",
                _brokerAddress, _port, _triggerTopic, _actionTopic, _mqttQoS);
        }

        protected override async Task OnStartAsync()
        {
            await base.OnStartAsync();
            await RetryWithBackoffAsync(ConnectAndSubscribeAsync, _cancellationTokenSource.Token);

            HandleMessage<ServerActionMessage>(message =>
            {
                _logger.LogWarning("==> HANDLER FIRED: ServerActionMessage");
                _logger.LogInformation("Received ServerActionMessage Trigger:");
                _logger.LogInformation("  ContextKey: {ContextKey}", message.ContextKey);
                _logger.LogInformation("  Layer: {Layer}", message.Layer);
                _logger.LogInformation("  Value: {Value}", message.Value);
                _logger.LogInformation("  Role: {Role}", message.Role);
                _logger.LogInformation("  SenderId: {SenderId}", message.SenderId);
                _logger.LogInformation("  ScenarioRole: {ScenarioRole}", message.ScenarioRole);
                _logger.LogInformation("  SessionId: {SessionId}", message.SessionId);

                if (message.Arguments != null && message.Arguments.Length > 0)
                {
                    foreach (var argument in message.Arguments)
                    {
                        _logger.LogInformation("  Argument - Name: {ArgumentName}, Value: {ArgumentValue}", argument.Name, argument.Value);
                    }
                }
                else
                {
                    _logger.LogInformation("  Arguments: None");
                }

                if (message.Role == Voxta.Model.Shared.ChatMessageRole.Event)
                {
                    _logger.LogInformation("Event detected: {EventName}", message.Value);
                }
                else
                {
                    _logger.LogInformation("Sending action trigger to MQTT broker");
                    var args = message.Arguments?.Select(arg => new[] { arg.Name, arg.Value }).ToArray();
                    SendMqttMessage(message.Value, args);
                }
            });

            HandleMessage<ServerActionAppTriggerMessage>(message =>
            {
                _logger.LogWarning("==> HANDLER FIRED: ServerActionAppTriggerMessage");
                _logger.LogInformation("Received ServerActionAppTriggerMessage Trigger:");
                _logger.LogInformation("  Name: {Name}", message.Name);
                _logger.LogInformation("  SenderId: {SenderId}", message.SenderId);
                _logger.LogInformation("  ScenarioRole: {ScenarioRole}", message.ScenarioRole);
                _logger.LogInformation("  SessionId: {SessionId}", message.SessionId);

                if (message.Arguments != null && message.Arguments.Length > 0)
                {
                    for (int i = 0; i < message.Arguments.Length; i++)
                    {
                        _logger.LogInformation("  Argument {Index}: {ArgumentValue}", i, message.Arguments[i]);
                    }
                }
                else
                {
                    _logger.LogInformation("  Arguments: None");
                }

                _logger.LogInformation("Sending AppTrigger to MQTT broker");
                var args = message.Arguments?.Select((v, i) => new string[] { $"arg{i}", v?.ToString() ?? "" }).ToArray();
                SendMqttMessage(message.Name, args);
            });
        }

        private void LogServerActionAppTriggerMessage(ServerActionAppTriggerMessage message)
        {
            _logger.LogInformation("Received ServerActionAppTriggerMessage:");
            _logger.LogInformation("  Name: {Name}", message.Name);
            _logger.LogInformation("  SenderId: {SenderId}", message.SenderId);
            _logger.LogInformation("  ScenarioRole: {ScenarioRole}", message.ScenarioRole);
            _logger.LogInformation("  SessionId: {SessionId}", message.SessionId);

            if (message.Arguments != null && message.Arguments.Length > 0)
            {
                for (int i = 0; i < message.Arguments.Length; i++)
                {
                    var argument = message.Arguments[i];
                    _logger.LogInformation("  Argument[{Index}]: {Argument}", i, argument);
                }
            }
            else
            {
                _logger.LogInformation("  Arguments: None");
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
                    _logger.LogWarning($"Retrying MQTT connection in {delay} seconds (attempt {retryCount}/{maxRetries})...");
                    await Task.Delay(TimeSpan.FromSeconds(delay), cancellationToken);
                }
            }
        }

        private async Task ConnectAndSubscribeAsync()
        {
            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(_brokerAddress, _port)
                .WithCleanSession()
                .Build();

            _logger.LogInformation("Connecting to MQTT broker at {BrokerAddress}:{Port}", _brokerAddress, _port);
            await _mqttClient.ConnectAsync(options, _cancellationTokenSource.Token);
            _logger.LogInformation("Connected to MQTT broker.");

            await _mqttClient.SubscribeAsync(_actionTopic, _mqttQoS);
            _logger.LogInformation("Subscribed to MQTT topic: {ActionTopic}", _actionTopic);

            _mqttClient.ApplicationMessageReceivedAsync += OnMqttMessageReceivedAsync;
        }

        private async Task OnMqttMessageReceivedAsync(MqttApplicationMessageReceivedEventArgs e)
        {
            var topic = e.ApplicationMessage.Topic;
            var payload = System.Text.Encoding.UTF8.GetString(e.ApplicationMessage.Payload);

            _logger.LogInformation("Received MQTT message on topic {Topic} with payload: {Payload}", topic, payload);

            try
            {
                var actionMessage = JsonSerializer.Deserialize<ActionMessage>(
                    payload,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (actionMessage == null || string.IsNullOrEmpty(actionMessage.Action))
                {
                    _logger.LogWarning("Invalid action message received: {Payload}", payload);
                    return;
                }

                if (actionMessage.Action == "remove")
                {
                    RemoveAction(actionMessage.Name);
                }
                else if (actionMessage.Action == "add")
                {
                    if (string.IsNullOrEmpty(actionMessage.Timing))
                    {
                        _logger.LogWarning("Missing Timing value for add action: {ActionName}", actionMessage.Name);
                        return;
                    }

                    var timing = MapTiming(actionMessage.Timing);
                    AddAction(actionMessage, timing);
                }
                else
                {
                    _logger.LogWarning("Unknown action type: {Action}", actionMessage.Action);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process MQTT message payload: {Payload}", payload);
            }
        }

        private void AddAction(ActionMessage actionMessage, FunctionTiming timing)
        {
            if (string.IsNullOrEmpty(actionMessage.Name))
            {
                _logger.LogWarning("Action name is required for adding an action.");
                return;
            }

            var actionDefinition = new ScenarioActionDefinition
            {
                Name = actionMessage.Name,
                Description = actionMessage.Description,
                Timing = timing,
                Layer = actionMessage.Layer ?? "default",
                Effect = new ActionEffect
                {
                    Secret = actionMessage.Secret,
                    Note = actionMessage.Note,
                    SetFlags = actionMessage.SetFlags
                },
                Arguments = actionMessage.Arguments?.Select(arg => new FunctionArgumentDefinition
                {
                    Name = arg.Name,
                    Type = Enum.TryParse<FunctionArgumentType>(arg.Type, out var parsedType) ? parsedType : FunctionArgumentType.String,
                    Required = arg.Required,
                    Description = arg.Description
                }).ToArray()
            };

            if (_registeredActions.TryAdd(actionMessage.Name, actionDefinition))
            {
                _logger.LogInformation("Added action: {ActionName}", actionMessage.Name);

                Send(new ClientUpdateContextMessage
                {
                    SessionId = SessionId,
                    ContextKey = "Actions",
                    Actions = _registeredActions.Values.ToArray()
                });
            }
            else
            {
                _logger.LogWarning("Action already exists: {ActionName}", actionMessage.Name);
            }
        }

        private void RemoveAction(string actionName)
        {
            if (string.IsNullOrEmpty(actionName))
            {
                _logger.LogWarning("Action name is required for removing an action.");
                return;
            }

            if (_registeredActions.TryRemove(actionName, out _))
            {
                _logger.LogInformation("Removed action: {ActionName}", actionName);
                UpdateChatContext();
            }
            else
            {
                _logger.LogWarning("Action does not exist: {ActionName}", actionName);
            }
        }

        private void UpdateChatContext()
        {
            var contextMessage = new ClientUpdateContextMessage
            {
                SessionId = SessionId,
                ContextKey = "Actions",
                Actions = _registeredActions.Values.ToArray()
            };

            Send(contextMessage);
            _logger.LogInformation("Updated Voxta chat context after action change. Total actions: {ActionCount}", _registeredActions.Count);
        }

        private void SendMqttMessage(string name, string[][]? args = null)
        {
            if (_mqttClient == null || !_mqttClient.IsConnected)
            {
                _logger.LogWarning("MQTT client is not connected. Skipping message send.");
                return;
            }

            var payloadString = name;
            if (args != null)
            {
                foreach (var kv in args)
                {
                    payloadString += $":{kv[0]}:{kv[1]}";
                }
            }

            var payload = System.Text.Encoding.UTF8.GetBytes(payloadString);
            var mqttMessage = new MqttApplicationMessageBuilder()
                .WithTopic(_triggerTopic)
                .WithPayload(payload)
                .WithQualityOfServiceLevel(_mqttQoS)
                .Build();

            _mqttClient.PublishAsync(mqttMessage).Wait();
            _logger.LogInformation("Successfully sent MQTT message: {Payload} to topic: {Topic}", payloadString, _triggerTopic);
        }

        private FunctionTiming MapTiming(string timing) => timing switch
        {
            "AfterUserMessage" => FunctionTiming.AfterUserMessage,
            "BeforeAssistantMessage" => FunctionTiming.BeforeAssistantMessage,
            "AfterAssistantMessage" => FunctionTiming.AfterAssistantMessage,
            "Manual" => FunctionTiming.Manual,
            "Button" => FunctionTiming.Button,
            _ => throw new ArgumentException($"Unknown Timing value: {timing}")
        };

        public async ValueTask DisposeAsync()
        {
            if (_disposed) return;

            _logger.LogInformation("Disposing ActionProvider...");
            _cancellationTokenSource.Cancel();

            if (_mqttClient.IsConnected)
            {
                await _mqttClient.DisconnectAsync();
                _logger.LogInformation("Disconnected from MQTT broker.");
            }

            _mqttClient.Dispose();
            _cancellationTokenSource.Dispose();
            _disposed = true;
        }

        public class ActionMqttOptions
        {
            public string BrokerAddress { get; set; }
            public int Port { get; set; }
            public string TriggerTopic { get; set; }
            public string ActionTopic { get; set; }
            public int QoS { get; set; }
        }

        public class ActionMessage
        {
            public string Action { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string Timing { get; set; }
            public string Layer { get; set; } = "default";
            public string[] SetFlags { get; set; }
            public string Secret { get; set; }
            public string Note { get; set; }
            public bool CancelReply { get; set; }
            public ArgumentDefinition[] Arguments { get; set; }
        }

        public class ArgumentDefinition
        {
            public string Name { get; set; }
            public string Type { get; set; }
            public bool Required { get; set; }
            public string Description { get; set; }
        }
    }
}
