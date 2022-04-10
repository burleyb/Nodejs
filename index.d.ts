import Pumpify from "pumpify";
import stream from "stream";
import { Callback, EnrichOptions, OffloadOptions, ReadOptions, StreamUtil, ToCheckpointOptions, WriteOptions } from "./lib/lib";
import { LeoCron } from "./lib/cron";
import { LeoDynamodb } from "./lib/dynamodb";
import AWS, { Credentials } from "aws-sdk";
import { Event } from "./lib/types";
import ConfigurationProvider from "./lib/rstreams-configuration";
export * from "./lib/types";

/**
 * The SDK needs these to communicate with an instance of the RStreams Bus.
 * These AWS resources were created as part of the RStreams Bus instance that you mean to access.  
 *
 * You will only rarely have to set these or even know about these yourself.
 * 
 * @see [[`ConfigProviderChain`]]
 */
export interface ConfigurationResources {
	/** The AWS region, e.g. us-east-1. */
	Region: string;

	/** The DynamoDB table name or ARN that stores the definition and state of all queues in the RStreams Bus instance. */
	LeoEvent: string;

	/** The DynamoDB table name or ARN that stores the actual events that flow through all queues in the RStreams Bus instance. */
	LeoStream: string;

	/** The DynamoDB table name or ARN that stores the definition and state of all bots in the RStreams Bus instance. */
	LeoCron: string;

	/** The S3 bucket name or ARN the RStreams Bus instance uses when reading/writing events to S3. */
	LeoS3: string;

	/** The name of the Kinesis stream or ARN the RStreams Bus instance uses to push events into a queue. */
	LeoKinesisStream: string;

	/** The name of the Firehose stream or ARN the RStreams Bus instance uses to push events into a queue. */
	LeoFirehoseStream: string;

	/** The DynamoDB table name or ARN that the RStreams Bus instance uses as a generic key/value store. */
	LeoSettings: string;
}

/**
 * An internal representation of the actual configuration used.  Developers should not have to set
 * anything in this config.  There are rare occasions when a developer may elect to set the AWS credentials
 * here manually, though the AWS SDK has much better means of discovering credentials in most cases.
 */
export interface Configuration {
	/** Stores the AWS region of the RStreams instance. */
	aws: { region: string },

	/** @deprecated Don't use. */
	_meta: { region: string },

	/** The resources used to communicate with the AWS resources that comprise the RStreams Bus instance. */
	resources: ConfigurationResources,

	/** Stores the AWS region of the RStreams instance. */
	region: string,

	/** @internal Allows different components of the SDK to internally share information. */
	registry: any;

	/** The AWS credentials to use. In most cases AWS will discover these.  Set if using STS or other scenarios where want to manually set them. */
	credentials?: Credentials

	// TODO: These exist but do we need to expose them
	//onUpdate: [Function: onUpdate],
	//update: [Function: update],
	//validate: [Function: validate],
	//setProfile: [Function: setProfile],
	//bus: {
	//	s3: 'clinttestbus-bus-1au1enwirg4no-leos3-feq3u3g89jgu',
	//	firehose: 'ClintTestBus-Bus-1AU1ENWIRG4NO-LeoFirehoseStream-4AGnnPEP5kml'
	//},
	//firehose: 'ClintTestBus-Bus-1AU1ENWIRG4NO-LeoFirehoseStream-4AGnnPEP5kml',
	//kinesis: 'ClintTestBus-Bus-1AU1ENWIRG4NO-LeoKinesisStream-n0KNkKCuP8EJ',
	//s3: 'clinttestbus-bus-1au1enwirg4no-leos3-feq3u3g89jgu',
	//stream: 'ClintTestBus-Bus-1AU1ENWIRG4NO-LeoKinesisStream-n0KNkKCuP8EJ',
}

/**
 * The main entry point for the RStreams Node SDK.  It exposes commonly used functionality
 * in the SDK.  Many of these functions come from [[`StreamUtil`]] which also includes
 * more advanced capabilities. 
 */
export interface RStreamsSdk {
	/** 
	 * Config used to communicate with AWS resources that comprise the RStreams Bus used by the SDK.
	 * It is included here for information purposes and so you can access the AWS resources that 
	 * the SDK discovered and is using.
	 *
	 * @see [[`ConfigProviderChain`]]  
	 */
	configuration: Configuration;

	/** 
	 * @return Rstreams - used to get the leo stream to do more advanced processing of the streams.
	 */
	streams: typeof StreamUtil,

	load: typeof StreamUtil.load;
	offload: typeof StreamUtil.offload;
	enrich: typeof StreamUtil.enrich;
	read: typeof StreamUtil.fromLeo;
	write: typeof StreamUtil.toLeo;
	checkpoint: typeof StreamUtil.toCheckpoint;

	/**
	 * Enrich events from one queue to another.  This is an async/await friendly version of the
	 * [[`RStreamsSdk.enrich`]]
	 * 
	 * @typeParam T The original event to be enriched
	 * @typeParam U The resulting event that has been enriched
	 * @param opts The details of how to enrich and the function that does the work to enrich
	 */
	enrichEvents: <T, U>(opts: EnrichOptions<T, U>) => Promise<void>;

	/**
	 * Process events from one queue to another.
	 * @param {EnrichOptions} opts
	 */
	offloadEvents: <T>(config: OffloadOptions<T>) => void;

	/**
	 * A callback-based way to write an event to a queue.
	 *
	 * @typeParam T The data to write as the payload of the event
	 * @param bot_id The name of the bot to write the event as
	 * @param outQueue The name of the queue to write to
	 * @param payload The payload of the event to write
	 * @param callback The function to call when done
	 * @todo inconsistent bot_id
	 */
	put: <T>(bot_id: string, outQueue: string, payload: Event<T> | T, callback: Callback) => void;

	/**
	 * An async/await friendly way to write an event to a queue.
	 *
	 * @typeParam T The data to write as the payload of the event
	 * @param bot_id The name of the bot to write the event as
	 * @param outQueue The name of the queue to write to
	 * @param payload The payload of the event to write
	 * @todo inconsistent bot_id
	 */
	putEvent: <T>(bot_id: string, outQueue: string, payload: Event<T> | T) => Promise<void>;
	
	/** A library allowing one to manually create, update, checkpoint or retrieve information on a bot. */
	bot: LeoCron,

	/**
	 * Contains a reference to helpful, commonly used libraries.
	 */
	aws: {
		/** Helpful methods for interacting with RStreams' DynamoDB tables. */
        dynamodb: LeoDynamodb,

		/** A refernce to the AWS S3 library. */
		s3: AWS.S3,

		/** A refernce to the AWS CloudFormation library. */
		cloudformation: AWS.CloudFormation
	}

	/**
	 * @deprecated This is a legacy feature that is no longer used that remains for backward compatibility.
	 */
	destroy: (callback: (err: any) => void) => void;
}

declare function ExportTypeFn(config?: ConfigurationResources | typeof ConfigurationProvider): RStreamsSdk;
export default ExportTypeFn;
