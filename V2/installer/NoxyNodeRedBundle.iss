#define MyAppName "noxy-red.core"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Yeti_CH"
#define MyAppExeName "runtime\node-v20.20.2-win-x64\node.exe"

[Setup]
AppId={{6B4EAF70-44EF-4A45-9E48-5B24734C5289}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={localappdata}\Programs\noxy-red.core
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
UsePreviousAppDir=no
UsePreviousTasks=no
UsePreviousLanguage=no
DisableFinishedPage=yes
PrivilegesRequired=lowest
ArchitecturesInstallIn64BitMode=x64compatible
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
OutputDir=..\build
OutputBaseFilename=noxy-red.core-setup
UninstallDisplayIcon={app}\noxyred.ico

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "installnodered"; Description: "Install Node-RED core"; GroupDescription: "Core options:"; Flags: checkedonce
Name: "desktopicon"; Description: "Create desktop shortcuts"; GroupDescription: "Shortcuts:"; Flags: checkedonce
Name: "startup"; Description: "Start Node-RED automatically when I sign in"; GroupDescription: "Node-RED options:"; Flags: unchecked
Name: "exampleflow"; Description: "Include the MFP.networked example flow"; GroupDescription: "Node-RED options:"; Flags: checkedonce
Name: "installmfp"; Description: "Install bundled MultiFunPlayer"; GroupDescription: "MultiFunPlayer options:"; Flags: checkedonce

[Files]
Source: "..\payload\node-red\runtime\*"; DestDir: "{app}\node-red\runtime"; Flags: recursesubdirs ignoreversion createallsubdirs; Check: IsNodeRedSelected
Source: "..\payload\node-red\app\*"; DestDir: "{app}\node-red\app"; Flags: recursesubdirs ignoreversion createallsubdirs; Check: IsNodeRedSelected
Source: "..\payload\node-red\custom-nodes\*"; DestDir: "{app}\node-red\custom-nodes"; Flags: recursesubdirs ignoreversion createallsubdirs; Check: IsNodeRedSelected
Source: "..\payload\node-red\user\settings.js"; DestDir: "{app}\node-red\user"; Flags: ignoreversion onlyifdoesntexist; Check: IsNodeRedSelected
Source: "..\payload\node-red\user\flows.empty.json"; DestDir: "{app}\node-red\user"; DestName: "flows.json"; Flags: ignoreversion onlyifdoesntexist; Check: IsNodeRedSelected and (not IsExampleFlowSelected)
Source: "..\payload\node-red\examples\example_MFP.networked_Import.json"; DestDir: "{app}\node-red\user"; DestName: "flows.json"; Flags: ignoreversion onlyifdoesntexist; Check: IsNodeRedSelected and IsExampleFlowSelected
Source: "..\payload\node-red\examples\example_MFP.networked_Import.json"; DestDir: "{app}\node-red\examples"; Flags: ignoreversion; Check: IsNodeRedSelected and IsExampleFlowSelected
Source: "..\noxyred.ico"; DestDir: "{app}\node-red"; Flags: ignoreversion; Check: IsNodeRedSelected
Source: "..\payload\mfp\MFP_1.31.5\*"; DestDir: "{app}\mfp"; Flags: recursesubdirs ignoreversion createallsubdirs; Check: IsMfpSelected

[Icons]
Name: "{group}\Start Node-RED"; Filename: "{app}\node-red\runtime\node-v20.20.2-win-x64\node.exe"; Parameters: """{app}\node-red\app\node_modules\node-red\red.js"" --userDir ""{app}\node-red\user"" --port 1880"; WorkingDir: "{app}\node-red"; IconFilename: "{app}\node-red\noxyred.ico"; Check: IsNodeRedSelected
Name: "{group}\Start MultiFunPlayer"; Filename: "{app}\mfp\MultiFunPlayer.exe"; WorkingDir: "{app}\mfp"; Check: IsMfpSelected
Name: "{autodesktop}\Start Node-RED"; Filename: "{app}\node-red\runtime\node-v20.20.2-win-x64\node.exe"; Parameters: """{app}\node-red\app\node_modules\node-red\red.js"" --userDir ""{app}\node-red\user"" --port 1880"; WorkingDir: "{app}\node-red"; Tasks: desktopicon; IconFilename: "{app}\node-red\noxyred.ico"; Check: IsNodeRedSelected
Name: "{autodesktop}\Start MultiFunPlayer"; Filename: "{app}\mfp\MultiFunPlayer.exe"; WorkingDir: "{app}\mfp"; Tasks: desktopicon; Check: IsMfpSelected

[Registry]
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName: "NoxyNodeRed"; ValueData: """{app}\node-red\runtime\node-v20.20.2-win-x64\node.exe"" ""{app}\node-red\app\node_modules\node-red\red.js"" --userDir ""{app}\node-red\user"" --port 1880"; Flags: uninsdeletevalue; Tasks: startup; Check: IsNodeRedSelected

[INI]
Filename: "{group}\Open Node-RED.url"; Section: "InternetShortcut"; Key: "URL"; String: "http://127.0.0.1:1880/"; Check: IsNodeRedSelected
Filename: "{autodesktop}\Open Node-RED.url"; Section: "InternetShortcut"; Key: "URL"; String: "http://127.0.0.1:1880/"; Tasks: desktopicon; Check: IsNodeRedSelected

[Code]
function IsExampleFlowSelected: Boolean;
begin
  Result := WizardIsTaskSelected('exampleflow');
end;

function IsNodeRedSelected: Boolean;
begin
  Result := WizardIsTaskSelected('installnodered');
end;

function IsMfpSelected: Boolean;
begin
  Result := WizardIsTaskSelected('installmfp');
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;

  if (CurPageID = wpSelectTasks) and (not IsNodeRedSelected) and (not IsMfpSelected) then
  begin
    MsgBox('Select at least Node-RED or MultiFunPlayer to continue.', mbError, MB_OK);
    Result := False;
  end;
end;
