# node-red-contrib-noxy-v2

Voxta nodes for direct use in Node-RED.

Nodes included:

- `voxta-events`
- `voxta-messages`
- `voxta-context`
- `voxta-actions`
- `voxta-sequencer`

They are built to access Voxta chat sessions, send messages, inject and read actions, handle context, and work directly inside normal Node-RED flows.

## Voxta setup

If Node-RED runs on another machine, edit Voxta `appsettings.json` manually and change the host binding from `http://localhost:5384` to `http://0.0.0.0:5384`.

Also make sure access is protected:

- set a password, or
- preauthorize the Node-RED host

Do not expose Voxta remotely without one of those in place.
