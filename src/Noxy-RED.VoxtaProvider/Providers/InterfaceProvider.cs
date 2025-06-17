using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Voxta.Providers.Host;
using vJoy.Wrapper;  // Provides the VirtualJoystick class

namespace Voxta.SampleProviderApp.Providers
{
    public class InterfaceProvider : ProviderBase, IAsyncDisposable
    {
        private readonly IMqttClient _mqttClient;
        private readonly string _keyboardTopic;
        private readonly string _keystrokesTopic;
        private readonly string _joystickTopic;
        private readonly ILogger<InterfaceProvider> _logger;
        private readonly string _brokerAddress;
        private readonly int _port;
        private readonly MqttQualityOfServiceLevel _mqttQoS;
        private readonly CancellationTokenSource _cancellationTokenSource = new();
        private bool _disposed = false;

        // VirtualJoystick configuration fields.
        private readonly VirtualJoystick _virtualJoystick;
        private readonly uint _vjoyDeviceId;
        private readonly uint _buttonCount;

        // MQTT options from appsettings.json under "MQTT"
        public class MqttOptions
        {
            public string BrokerAddress { get; set; }
            public int Port { get; set; }
            public string KeyboardTopic { get; set; }
            public string KeystrokesTopic { get; set; }
            public int QoS { get; set; }
        }

        // Interface options from appsettings.json under "Interfaces"
        public class InterfaceOptions
        {
            public int Buttoncount { get; set; }
            public int vjoydevice { get; set; }
        }

        #region Keyboard Emulation with Scan Code Integration

        // Import user32.dll for keystroke simulation.
        [DllImport("user32.dll", SetLastError = true)]
        private static extern void keybd_event(byte bVk, byte bScan, int dwFlags, int dwExtraInfo);

        // Import MapVirtualKey to convert a virtual key to its hardware scan code.
        [DllImport("user32.dll", SetLastError = true)]
        private static extern uint MapVirtualKey(uint uCode, uint uMapType);

        // Constants for keybd_event flags.
        private const int KEYEVENTF_EXTENDEDKEY = 0x0001;
        private const int KEYEVENTF_KEYUP = 0x0002;
        private const int KEYEVENTF_SCANCODE = 0x0008;

        /// <summary>
        /// Simulate a key press (key down) using both the virtual key code and its hardware scan code.
        /// </summary>
        private void SendKeyDown(int vkCode)
        {
            // Get the scan code from the virtual key.
            uint scanCode = MapVirtualKey((uint)vkCode, 0); // MAPVK_VK_TO_VSC (0) conversion
            int flags = KEYEVENTF_SCANCODE; // Always include scancode for hardware-level simulation

            // Mark keys that are "extended" (like right CTRL, right ALT, arrow keys, etc.).
            if (IsExtendedKey(vkCode))
            {
                flags |= KEYEVENTF_EXTENDEDKEY;
            }
            keybd_event((byte)vkCode, (byte)scanCode, flags, 0);
        }

        /// <summary>
        /// Simulate a key release (key up) using both the virtual key code and its hardware scan code.
        /// </summary>
        private void SendKeyUp(int vkCode)
        {
            uint scanCode = MapVirtualKey((uint)vkCode, 0);
            int flags = KEYEVENTF_SCANCODE | KEYEVENTF_KEYUP;
            if (IsExtendedKey(vkCode))
            {
                flags |= KEYEVENTF_EXTENDEDKEY;
            }
            keybd_event((byte)vkCode, (byte)scanCode, flags, 0);
        }

        /// <summary>
        /// Determines if a virtual key is considered an "extended" key.
        /// Extended keys include right-hand keys (like VK_RCONTROL and VK_RMENU),
        /// arrow keys, Insert, Delete, Home, End, Page Up, Page Down, and Numpad Divide.
        /// </summary>
        private bool IsExtendedKey(int vkCode)
        {
            switch (vkCode)
            {
                case 0xA3: // Right CTRL
                case 0xA5: // Right ALT
                case 0x6F: // Numpad Divide
                case 0x25: // Left Arrow
                case 0x26: // Up Arrow
                case 0x27: // Right Arrow
                case 0x28: // Down Arrow
                case 0x2D: // Insert
                case 0x2E: // Delete
                case 0x23: // End
                case 0x24: // Home
                case 0x21: // Page Up
                case 0x22: // Page Down
                    return true;
                default:
                    return false;
            }
        }

        #endregion

        /// <summary>
        /// Constructor: reads configuration, initializes MQTT, and acquires the VirtualJoystick.
        /// </summary>
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
            _joystickTopic = configuration["JoystickTopic"] ?? "/noxyred/joystick";
            _brokerAddress = mqttOptions.BrokerAddress;
            _port = mqttOptions.Port;
            _mqttQoS = (MqttQualityOfServiceLevel)Enum.ToObject(typeof(MqttQualityOfServiceLevel), mqttOptions.QoS);

            // Read vJoy settings from the "Interfaces" section.
            var interfaceOptions = configuration.GetSection("Interfaces").Get<InterfaceOptions>();
            _buttonCount = (uint)(interfaceOptions?.Buttoncount ?? 32);
            _vjoyDeviceId = (uint)(interfaceOptions?.vjoydevice ?? 1);

            _logger.LogInformation(
                "InterfaceProvider initialized with BrokerAddress: {BrokerAddress}, Port: {Port}, KeyboardTopic: {KeyboardTopic}, JoystickTopic: {JoystickTopic}, vJoy Device: {vjoyDeviceId}, and QoS: {QoS}",
                _brokerAddress, _port, _keyboardTopic, _joystickTopic, _vjoyDeviceId, _mqttQoS);

            try
            {
                // Create and acquire the VirtualJoystick using the device id (as a uint).
                _virtualJoystick = new VirtualJoystick(_vjoyDeviceId);
                _virtualJoystick.Aquire();
                _logger.LogInformation("Acquired VirtualJoystick device {vjoyDeviceId}", _vjoyDeviceId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to acquire VirtualJoystick device {vjoyDeviceId}", _vjoyDeviceId);
            }
        }

        /// <summary>
        /// Starts the provider by connecting to the MQTT broker.
        /// </summary>
        protected override async Task OnStartAsync()
        {
            await base.OnStartAsync();
            await RetryWithBackoffAsync(ConnectAndSubscribeAsync, _cancellationTokenSource.Token);
        }

        /// <summary>
        /// Retries an asynchronous action using exponential backoff.
        /// </summary>
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

        /// <summary>
        /// Handles incoming MQTT messages. For the joystick topic, if a payload like "button:1"
        /// is received, the corresponding button is pressed and then released.
        /// </summary>
        private async Task OnMqttMessageReceivedAsync(MqttApplicationMessageReceivedEventArgs e)
        {
            string topic = e.ApplicationMessage.Topic;
            string payload = Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment);
            _logger.LogInformation("Received MQTT message on topic {Topic}: {Payload}", topic, payload);

            if (topic.Equals(_keyboardTopic, StringComparison.OrdinalIgnoreCase))
            {
                // Process keyboard command.
                payload = payload.Trim('[', ']');
                _logger.LogDebug("Processing keyboard command: {Payload}", payload);

                List<int> vkCodes = ParseVkCodes(payload);
                if (vkCodes.Count == 0)
                {
                    _logger.LogWarning("Invalid keystroke payload: {Payload}", payload);
                    return;
                }

                _logger.LogInformation("Simulating keystroke sequence: {VkSequence}", vkCodes);
                if (vkCodes.Count == 1)
                {
                    int vkCode = vkCodes[0];
                    SendKeyDown(vkCode);
                    await Task.Delay(100);
                    SendKeyUp(vkCode);
                }
                else
                {
                    foreach (int vkCode in vkCodes)
                    {
                        SendKeyDown(vkCode);
                        await Task.Delay(50);
                    }
                    await Task.Delay(200);
                    foreach (int vkCode in vkCodes.AsEnumerable().Reverse())
                    {
                        SendKeyUp(vkCode);
                        await Task.Delay(50);
                    }
                }
            }
            else if (topic.Equals(_joystickTopic, StringComparison.OrdinalIgnoreCase))
            {
                // Process joystick command. Expected payload format: "button:xxx" where xxx is the button number.
                if (payload.StartsWith("button:", StringComparison.OrdinalIgnoreCase))
                {
                    string buttonStr = payload.Substring("button:".Length).Trim();
                    if (uint.TryParse(buttonStr, out uint buttonNumber))
                    {
                        if (buttonNumber >= 1 && buttonNumber <= _buttonCount)
                        {
                            _logger.LogInformation("Simulating joystick button press: {ButtonNumber}", buttonNumber);
                            await SimulateJoystickButtonPress(buttonNumber);
                        }
                        else
                        {
                            _logger.LogWarning("Button number {ButtonNumber} is out of range. Allowed range is 1 to {ButtonCount}", buttonNumber, _buttonCount);
                        }
                    }
                    else
                    {
                        _logger.LogWarning("Invalid button number format: {ButtonStr}", buttonStr);
                    }
                }
                else
                {
                    _logger.LogWarning("Unrecognized joystick command: {Payload}", payload);
                }
            }
            else
            {
                _logger.LogWarning("Message received on unknown topic: {Topic}", topic);
            }
        }

        /// <summary>
        /// Parses a comma-separated string of virtual-key codes. Supports hexadecimal (e.g., "0x41")
        /// and decimal formats.
        /// </summary>
        private List<int> ParseVkCodes(string payload)
        {
            List<int> vkCodes = new();
            string[] parts = payload.Split(',');
            foreach (string part in parts)
            {
                string trimmed = part.Trim();
                if (trimmed.StartsWith("0x", StringComparison.OrdinalIgnoreCase))
                {
                    if (int.TryParse(trimmed.Substring(2), System.Globalization.NumberStyles.HexNumber, null, out int vkCode))
                    {
                        vkCodes.Add(vkCode);
                    }
                    else
                    {
                        _logger.LogWarning("Failed to parse hex VK code: {HexCode}", trimmed);
                    }
                }
                else if (int.TryParse(trimmed, out int vkCode))
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

        /// <summary>
        /// Connects to the MQTT broker and subscribes to the necessary topics.
        /// </summary>
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

            _logger.LogDebug("Subscribing to topic: {JoystickTopic} with QoS {QoS}", _joystickTopic, _mqttQoS);
            await _mqttClient.SubscribeAsync(new MqttTopicFilterBuilder().WithTopic(_joystickTopic).WithQualityOfServiceLevel(_mqttQoS).Build());
            _logger.LogInformation("Subscribed to MQTT topic: {JoystickTopic}", _joystickTopic);

            // Wire up the message received handler.
            _mqttClient.ApplicationMessageReceivedAsync += async e => await OnMqttMessageReceivedAsync(e);
        }

        /// <summary>
        /// Simulates a joystick button press by pressing the button, delaying, then releasing it.
        /// </summary>
        /// <param name="buttonNumber">The 1-based button number.</param>
        private async Task SimulateJoystickButtonPress(uint buttonNumber)
        {
            _virtualJoystick.SetJoystickButton(true, buttonNumber);
            await Task.Delay(100);
            _virtualJoystick.SetJoystickButton(false, buttonNumber);
        }

        /// <summary>
        /// Releases resources by disconnecting from MQTT.
        /// (No relinquish function is required for VirtualJoystick.)
        /// </summary>
        public async ValueTask DisposeAsync()
        {
            if (!_disposed)
            {
                _cancellationTokenSource.Cancel();
                if (_mqttClient.IsConnected)
                {
                    await _mqttClient.DisconnectAsync();
                }
                _cancellationTokenSource.Dispose();
                _disposed = true;
            }
        }
    }
}
