// NOTE: sockets event names should be unique across different rooms to avoid conflict
export const SOCKET_EVENT_NAME = {
  // business app socket events
  JOIN_BUSINESS_APP_ROOM: 'join_business_app_room',
  LEAVE_BUSINESS_APP_ROOM: 'leave_business_app_room',
  JOIN_BUSINESS_APP_PROJ_ROOM: 'join_business_app_proj_room',
  LEAVE_BUSINESS_APP_PROJ_ROOM: 'leave_business_app_proj_room',
  DELETE_BUSINESS_APP: 'delete_business_app',
  ADD_BUSINESS_APP: 'add_business_app',
  UPDATE_BUSINESS_APP: 'update_business_app',
  UPDATE_BUSINESS_APP_TAB_ORDER: 'update_business_app_tab_order',
  CREATE_WIDGET: 'create_widget',
  DELETE_WIDGET: 'delete_widget',
  UPDATE_WIDGET: 'update_widget',
  UPDATE_APP_SUCCESS: 'update_app_success',
  DELETE_APP_SUCCESS: 'delete_app_success',
  UPDATE_APP_TAB_ORDER_SUCCESS: 'update_app_tab_order_success',
  JOIN_APP_BUILDER_ROOM: 'join_app_builder_room',
  LEAVE_APP_BUILDER_ROOM: 'leave_app_builder_room'
};
