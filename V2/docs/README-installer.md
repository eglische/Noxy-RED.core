# Noxy Installer Workspace

This workspace contains an offline installer payload for:

- portable Node.js runtime
- Node-RED
- `node-red-contrib-noxy-v2`
- optional `MFP.networked` example flow
- bundled MultiFunPlayer `1.31.5`

Expected build tool:

- Inno Setup 6

Important folders:

- `payload/node-red/runtime`: portable Node.js
- `payload/node-red/app`: bundled Node-RED app and dependencies
- `payload/node-red/user`: default Node-RED user directory content
- `payload/node-red/custom-nodes`: local custom Node-RED nodes
- `payload/mfp`: bundled MultiFunPlayer payload
- `installer`: Inno Setup script
- `scripts`: helper launchers copied into the install target

The installer is designed to work offline after it has been built.
