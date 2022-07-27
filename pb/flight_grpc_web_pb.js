/**
 * @fileoverview gRPC-Web generated client stub for flight
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


// var google_api_annotations_pb = require('./google/api/annotations_pb.js')
const proto = {};
proto.flight = require('./flight_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.flight.FlightServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

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
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.flight.FlightServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

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
 *   !proto.flight.CalculationRequest,
 *   !proto.flight.CalculationResponse>}
 */
const methodDescriptor_FlightService_GetPercentage = new grpc.web.MethodDescriptor(
  '/flight.FlightService/GetPercentage',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.flight.CalculationRequest,
  proto.flight.CalculationResponse,
  /**
   * @param {!proto.flight.CalculationRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.flight.CalculationResponse.deserializeBinary
);


/**
 * @param {!proto.flight.CalculationRequest} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.flight.CalculationResponse>}
 *     The XHR Node Readable Stream
 */
proto.flight.FlightServiceClient.prototype.getPercentage =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/flight.FlightService/GetPercentage',
      request,
      metadata || {},
      methodDescriptor_FlightService_GetPercentage);
};


/**
 * @param {!proto.flight.CalculationRequest} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.flight.CalculationResponse>}
 *     The XHR Node Readable Stream
 */
proto.flight.FlightServicePromiseClient.prototype.getPercentage =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/flight.FlightService/GetPercentage',
      request,
      metadata || {},
      methodDescriptor_FlightService_GetPercentage);
};


module.exports = proto.flight;

