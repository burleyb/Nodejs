let paths = module.paths;
module.paths = require('module')._nodeModulePaths(process.cwd());
let aws = {}

const {CloudFormation} = require("@aws-sdk/client-cloudformation");
aws.CloudFormation = CloudFormation
aws.cloudformation = CloudFormation

const {KMS} = require("@aws-sdk/client-kms");
aws.KMS = KMS
aws.kms = KMS

const { DynamoDBClient, BatchExecuteStatementCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "REGION" });
aws.DynamoDB = DynamoDBClient
aws.dynamodb = DynamoDBClient

const {Kinesis} = require("@aws-sdk/client-kinesis");
aws.Kinesis = Kinesis
aws.kinesis = Kinesis

const {Firehose} = require("@aws-sdk/client-firehose");
aws.Firehose = Firehose
aws.firehose = Firehose

const {S3} = require("@aws-sdk/client-s3");
aws.S3 = S3
aws.s3 = S3

const {CloudWatchLogs} = require("@aws-sdk/client-cloudwatch-logs");
aws.CloudWatchLogs = CloudWatchLogs
aws.cloudwatchlogs = CloudWatchLogs

const {SNS} = require("@aws-sdk/client-sns");
aws.SNS = SNS
aws.sns = SNS

const {SES} = require("@aws-sdk/client-ses");
aws.SES = SES
aws.ses = SES

const {loadSharedConfigFiles} = require("@aws-sdk/shared-ini-file-loader");
aws.SharedIniFileCredentials = loadSharedConfigFiles
aws.sharedinifilecredentials = loadSharedConfigFiles
aws.loadSharedConfigFiles = loadSharedConfigFiles
aws.loadsharedconfigfiles = loadSharedConfigFiles


module.paths = paths;
module.exports = aws;
