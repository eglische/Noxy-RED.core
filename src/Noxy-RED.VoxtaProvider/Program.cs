using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Voxta.Providers.Host;
using Voxta.SampleProviderApp;
using Voxta.SampleProviderApp.Providers;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

static bool IsProcessRunning(string processName)
{
    return Process.GetProcessesByName(processName).Any();
}

static async Task<bool> IsNodeRedRunningAsync()
{
    using var httpClient = new HttpClient();
    try
    {
        var response = await httpClient.GetAsync("http://127.0.0.1:1880/");
        return response.IsSuccessStatusCode;
    }
    catch
    {
        return false;
    }
}

static async Task RunDependenciesInstaller()
{
    try
    {
        string scriptPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "dependencies.ps1");
        if (!File.Exists(scriptPath))
        {
            Console.WriteLine($"Error: dependencies.ps1 not found at {scriptPath}");
            return;
        }

        ProcessStartInfo psi = new ProcessStartInfo
        {
            FileName = "powershell.exe",
            Arguments = $"-NoExit -ExecutionPolicy Bypass -File \"{scriptPath}\"",
            UseShellExecute = true,
            Verb = "runas",
            WorkingDirectory = AppDomain.CurrentDomain.BaseDirectory
        };
        Process.Start(psi);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Failed to start dependencies.ps1: {ex.Message}");
    }
}

static void OpenHelpPage()
{
    Process.Start(new ProcessStartInfo
    {
        FileName = "https://github.com/eglische/Noxy-RED.core",
        UseShellExecute = true
    });
}

static async Task<bool> StartProcessAndWaitAsync(string processName, string command, int maxWaitTimeSeconds = 30, bool checkHttp = false)
{
    if (IsProcessRunning(processName) || (checkHttp && await IsNodeRedRunningAsync()))
    {
        Console.WriteLine($"{processName} is already running.");
        return true;
    }

    Console.WriteLine($"Starting {processName}...");
    try
    {
        ProcessStartInfo startInfo = new ProcessStartInfo
        {
            FileName = "cmd.exe",
            Arguments = $"/c \"{command}\"",
            UseShellExecute = true,
            WindowStyle = ProcessWindowStyle.Normal
        };
        Process.Start(startInfo);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Failed to start {processName}: {ex.Message}");
        return false;
    }

    int elapsedSeconds = 0;
    while ((!IsProcessRunning(processName) && !(checkHttp && await IsNodeRedRunningAsync())) && elapsedSeconds < maxWaitTimeSeconds)
    {
        Console.WriteLine($"Waiting for {processName} to start... ({elapsedSeconds}/{maxWaitTimeSeconds} sec)");
        await Task.Delay(1000);
        elapsedSeconds++;
    }

    if (IsProcessRunning(processName) || (checkHttp && await IsNodeRedRunningAsync()))
    {
        Console.WriteLine($"{processName} is running!");
        return true;
    }
    else
    {
        Console.WriteLine($"Noxy-RED.core could not find {processName} installed on your system.");
        Console.WriteLine("Would you like to run the first-time installation (again)?");
        Console.WriteLine("Options: Install | Help | Close");
        while (true)
        {
            Console.Write("Enter your choice: ");
            string choice = Console.ReadLine()?.Trim().ToLower();
            switch (choice)
            {
                case "install":
                    await RunDependenciesInstaller();
                    return false;
                case "help":
                    OpenHelpPage();
                    break;
                case "close":
                    Environment.Exit(0);
                    break;
                default:
                    Console.WriteLine("Invalid choice. Please enter Install, Help, or Close.");
                    break;
            }
        }
    }
}

// Load configuration
var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();

// Display banner
EnableVirtualTerminal();
DrawBanner();
Console.Write("\x1b[6;999r"); // Lock scroll region from row 6 downward
Console.SetCursorPosition(0, 6); // Ensure cursor below banner

string coreMethod = configuration["Voxta.Provider:Noxy-RED.coreMethod"] ?? "local";

if (coreMethod == "local")
{
    if (!await StartProcessAndWaitAsync("mosquitto", "\"C:\\Program Files\\Mosquitto\\mosquitto.exe\" -v", 5))
        return;

    string nodeExePath = "\"C:\\Program Files\\nodejs\\node.exe\"";
    string redJsPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "npm", "node_modules", "node-red", "red.js");
    if (!await StartProcessAndWaitAsync("node", $"{nodeExePath} \"{redJsPath}\"", 40, true))
        return;
}

// Dependency Injection
var services = new ServiceCollection();
services.AddSingleton<IConfiguration>(configuration);
services.AddOptions<SampleProviderAppOptions>()
    .Bind(configuration.GetSection("SampleProviderApp"))
    .ValidateDataAnnotations();

// Logging
await using var log = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .MinimumLevel.Debug()
    .CreateLogger();
services.AddLogging(builder => builder.AddSerilog(log));

// Dependencies
services.AddHttpClient();

// Voxta Providers
services.AddVoxtaProvider(builder =>
{
    builder.AddProvider<ActionProvider>();
    builder.AddProvider<BackgroundContextUpdaterProvider>();
    builder.AddProvider<AutoReplyProvider>();
    builder.AddProvider<UserFunctionProvider>();
    builder.AddProvider<AudioProvider>();
    builder.AddProvider<ContextProvider>();
    builder.AddProvider<InterfaceProvider>();
    builder.AddProvider<ApplicationProvider>();
});

// Build and run
var sp = services.BuildServiceProvider();
var runtime = sp.GetRequiredService<IProviderAppHandler>();
var cts = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) => { e.Cancel = true; cts.Cancel(); };

await RunWithRetriesAsync(() => runtime.RunAsync(cts.Token), cts.Token);

async Task RunWithRetriesAsync(Func<Task> runFunction, CancellationToken cancellationToken)
{
    const int maxRetries = 5;
    int retryCount = 0;
    const int initialDelaySeconds = 2;
    const int maxDelaySeconds = 60;

    while (!cancellationToken.IsCancellationRequested)
    {
        try
        {
            await runFunction();
            return;
        }
        catch (Exception ex)
        {
            log.Error(ex, "Error in application execution. Attempting to retry...");

            if (++retryCount > maxRetries)
            {
                log.Fatal("Maximum retry attempts reached. Shutting down.");
                throw;
            }

            int delay = Math.Min(initialDelaySeconds * (int)Math.Pow(2, retryCount), maxDelaySeconds);
            log.Warning($"Retrying in {delay} seconds (attempt {retryCount}/{maxRetries})...");
            await Task.Delay(TimeSpan.FromSeconds(delay), cancellationToken);
        }
    }
    log.Information("Cancellation requested. Exiting gracefully...");
}

async Task DisposeResourcesOnShutdown(ServiceProvider serviceProvider, CancellationToken cancellationToken)
{
    try
    {
        if (cancellationToken.IsCancellationRequested)
        {
            log.Information("Shutting down the application and disposing resources...");
            if (serviceProvider is IDisposable disposable)
            {
                await Task.Run(() => disposable.Dispose());
                log.Information("Resources disposed successfully.");
            }
        }
    }
    catch (Exception ex)
    {
        log.Error(ex, "Error occurred while disposing resources during shutdown.");
    }
}

await DisposeResourcesOnShutdown(sp, cts.Token);

static void EnableVirtualTerminal()
{
    if (OperatingSystem.IsWindows())
    {
        var handle = NativeMethods.GetStdHandle(-11);
        NativeMethods.GetConsoleMode(handle, out var mode);
        mode |= 0x0004;
        NativeMethods.SetConsoleMode(handle, mode);
    }
}

static void DrawBanner()
{
    Console.Clear();
    int width = Console.WindowWidth;
    string lineTop = new string('=', width);

    string centeredTitle = CenterText("<<<<==== \x1b[37mNoxy-\x1b[31mRED\x1b[37m.core\x1b[0m ====>>>>", width);
    string centeredInfo = CenterText("\x1b[34mby: Yeti_CH\x1b[0m  —  for support: ping \x1b[34m@yeti_ch\x1b[0m in the Voxta Discord under projects-> noxy-red", width);

    Console.WriteLine(lineTop);
    Console.WriteLine(centeredTitle);
    Console.WriteLine(lineTop);
    Console.WriteLine(centeredInfo);
    Console.WriteLine();
}

static string CenterText(string text, int width)
{
    int rawLength = StripAnsi(text).Length;
    int padding = Math.Max((width - rawLength) / 2, 0);
    return new string(' ', padding) + text;
}

static string StripAnsi(string input)
{
    return System.Text.RegularExpressions.Regex.Replace(input, @"\x1B\[[0-9;]*[mGKH]", "");
}

internal static class NativeMethods
{
    [System.Runtime.InteropServices.DllImport("kernel32.dll", SetLastError = true)]
    internal static extern IntPtr GetStdHandle(int nStdHandle);

    [System.Runtime.InteropServices.DllImport("kernel32.dll", SetLastError = true)]
    internal static extern bool GetConsoleMode(IntPtr hConsoleHandle, out int lpMode);

    [System.Runtime.InteropServices.DllImport("kernel32.dll", SetLastError = true)]
    internal static extern bool SetConsoleMode(IntPtr hConsoleHandle, int dwMode);
}
