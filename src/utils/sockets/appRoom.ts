import { SOCKET_EVENT_NAME } from '../../constants/socket';
/**
 *
 * @param {*} socket - The socket instance
 * @param {Object} params - the params for the socket event
 * @param {String} params.app_version_id - app_version_id
 */
export async function joinAppBuilderRoom(socket: any, params: any) {
  const response = await socket.timeout(10000).emitWithAck(SOCKET_EVENT_NAME.JOIN_APP_BUILDER_ROOM, params);
  return response;
}

/**
 *
 * @param {*} socket - The socket instance
 * @param {Object} params - the params for the socket event
 * @param {String} params.app_version_id - app_version_id
 */
export async function leaveAppBuilderRoom(socket: any, params: any) {
  const response = await socket.timeout(10000).emitWithAck(SOCKET_EVENT_NAME.LEAVE_APP_BUILDER_ROOM, params);
  return response;
}
