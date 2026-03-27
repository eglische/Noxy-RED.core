# Noxy Installer Workspace

This workspace contains the installer sources and lightweight payload metadata for:

- portable Node.js runtime reference
- Node-RED package reference
- `node-red-contrib-noxy-v2`
- optional `MFP.networked` example flow
- bundled MultiFunPlayer `1.31.5`

Expected build tool:

- Inno Setup 6

Important folders:

- `payload/node-red/runtime`: placeholder with source reference for the portable Node.js runtime
- `payload/node-red/app`: Node-RED package manifest and lockfile
- `payload/node-red/user`: default Node-RED user directory content
- `payload/node-red/custom-nodes`: local custom Node-RED nodes
- `payload/mfp`: bundled MultiFunPlayer payload
- `installer`: Inno Setup script
- `scripts`: build helper scripts

To keep the Git repository smaller, the full extracted Node.js runtime and expanded `node_modules` tree are not stored here.
Before building the installer, restore those payload folders from the sources documented in:

- `payload/node-red/runtime/SOURCE.txt`
- `payload/node-red/app/SOURCE.txt`
