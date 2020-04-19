/* eslint-disable */
/**
 * @fileoverview gRPC-Web generated client stub for garageopener
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.garageopener = require('./garage_opener_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.garageopener.GarageOpenerClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.garageopener.GarageOpenerPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.garageopener.Empty,
 *   !proto.garageopener.DoorState>}
 */
const methodDescriptor_GarageOpener_GetGarageDoorState = new grpc.web.MethodDescriptor(
  '/garageopener.GarageOpener/GetGarageDoorState',
  grpc.web.MethodType.UNARY,
  proto.garageopener.Empty,
  proto.garageopener.DoorState,
  /**
   * @param {!proto.garageopener.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.garageopener.DoorState.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.garageopener.Empty,
 *   !proto.garageopener.DoorState>}
 */
const methodInfo_GarageOpener_GetGarageDoorState = new grpc.web.AbstractClientBase.MethodInfo(
  proto.garageopener.DoorState,
  /**
   * @param {!proto.garageopener.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.garageopener.DoorState.deserializeBinary
);


/**
 * @param {!proto.garageopener.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.garageopener.DoorState)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.garageopener.DoorState>|undefined}
 *     The XHR Node Readable Stream
 */
proto.garageopener.GarageOpenerClient.prototype.getGarageDoorState =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/garageopener.GarageOpener/GetGarageDoorState',
      request,
      metadata || {},
      methodDescriptor_GarageOpener_GetGarageDoorState,
      callback);
};


/**
 * @param {!proto.garageopener.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.garageopener.DoorState>}
 *     A native promise that resolves to the response
 */
proto.garageopener.GarageOpenerPromiseClient.prototype.getGarageDoorState =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/garageopener.GarageOpener/GetGarageDoorState',
      request,
      metadata || {},
      methodDescriptor_GarageOpener_GetGarageDoorState);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.garageopener.ChangeDoorStateRequest,
 *   !proto.garageopener.ChangeDoorStateResponse>}
 */
const methodDescriptor_GarageOpener_ChangeDoorState = new grpc.web.MethodDescriptor(
  '/garageopener.GarageOpener/ChangeDoorState',
  grpc.web.MethodType.UNARY,
  proto.garageopener.ChangeDoorStateRequest,
  proto.garageopener.ChangeDoorStateResponse,
  /**
   * @param {!proto.garageopener.ChangeDoorStateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.garageopener.ChangeDoorStateResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.garageopener.ChangeDoorStateRequest,
 *   !proto.garageopener.ChangeDoorStateResponse>}
 */
const methodInfo_GarageOpener_ChangeDoorState = new grpc.web.AbstractClientBase.MethodInfo(
  proto.garageopener.ChangeDoorStateResponse,
  /**
   * @param {!proto.garageopener.ChangeDoorStateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.garageopener.ChangeDoorStateResponse.deserializeBinary
);


/**
 * @param {!proto.garageopener.ChangeDoorStateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.garageopener.ChangeDoorStateResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.garageopener.ChangeDoorStateResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.garageopener.GarageOpenerClient.prototype.changeDoorState =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/garageopener.GarageOpener/ChangeDoorState',
      request,
      metadata || {},
      methodDescriptor_GarageOpener_ChangeDoorState,
      callback);
};


/**
 * @param {!proto.garageopener.ChangeDoorStateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.garageopener.ChangeDoorStateResponse>}
 *     A native promise that resolves to the response
 */
proto.garageopener.GarageOpenerPromiseClient.prototype.changeDoorState =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/garageopener.GarageOpener/ChangeDoorState',
      request,
      metadata || {},
      methodDescriptor_GarageOpener_ChangeDoorState);
};


module.exports = proto.garageopener;

