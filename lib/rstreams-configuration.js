"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_util_1 = __importDefault(require("./aws-util"));
/**
 * Represents your RSTREAMS configuration
 * Creating a `Configuration` object allows you to pass around your
 * coinfig information to configuration and service objects.
 *
 *
 * ## Expiring and Refreshing Configuration
 *
 * Occasionally configuration can expire in the middle of a long-running
 * application. In this case, the SDK will automatically attempt to
 * refresh the configuration from the storage location if the Configuration
 * class implements the {refresh} method.
 *
 * If you are implementing a configuration storage location, you
 * will want to create a subclass of the `Configuration` class and
 * override the {refresh} method. This method allows configuration to be
 * retrieved from the backing store, be it a file system, database, or
 * some network storage. The method should reset the configuration attributes
 * on the object.
 *
 * @!attribute expired
 *   @return [Boolean] whether the configuration have been expired and
 *     require a refresh. Used in conjunction with {expireTime}.
 * @!attribute expireTime
 *   @return [Date] a time when configuration should be considered expired. Used
 *     in conjunction with {expired}.

 */
class Configuration {
    /**
     * A configuration object can be created using positional arguments or an options
     * hash.
     *

     */
    constructor(config = {}) {
        this.expireTime = 0;
        this.expired = false;
        /**
         * @return [Integer] the number of seconds before {expireTime} during which
         *   the configuration will be considered expired.
         */
        this.expiryWindow = 15;
        this.update(config);
    }
    update(config = {}) {
        this.expired = false;
        this.expireTime = 0;
        // Got verbose style so switch it to just the resource style
        if (config.s3 && config.resources) {
            config = config.resources;
        }
        [
            "Region",
            "LeoStream",
            "LeoCron",
            "LeoEvent",
            "LeoS3",
            "LeoKinesisStream",
            "LeoFirehoseStream",
            "LeoSettings",
            "LeoSystem"
        ].forEach(field => {
            this[field] = config[field];
        });
    }
    /**
     * @return [Boolean] whether the configuration object should call {refresh}
     * @note Subclasses should override this method to provide custom refresh
     *   logic.
     */
    needsRefresh() {
        let currentTime = aws_util_1.default.date.getDate().getTime();
        let adjustedTime = new Date(currentTime + this.expiryWindow * 1000);
        if (this.expireTime && adjustedTime.valueOf() > this.expireTime) {
            return true;
        }
        else {
            let valid = [
                "Region",
                "LeoStream",
                "LeoCron",
                "LeoEvent",
                "LeoS3",
                "LeoKinesisStream",
                "LeoFirehoseStream",
                "LeoSettings",
                "LeoSystem"
            ].every(field => {
                return this[field] != null || field === "LeoSettings" || field === "LeoSystem";
            });
            return this.expired || !valid;
        }
    }
    resolveSync() {
        this.getSync();
        return {
            Region: this.Region,
            LeoStream: this.LeoStream,
            LeoCron: this.LeoCron,
            LeoEvent: this.LeoEvent,
            LeoS3: this.LeoS3,
            LeoKinesisStream: this.LeoKinesisStream,
            LeoFirehoseStream: this.LeoFirehoseStream,
            LeoSettings: this.LeoSettings,
            LeoSystem: this.LeoSystem,
        };
    }
    /**
     * Gets the existing configuration, refreshing them if they are not yet loaded
     * or have expired. Users should call this method before using {refresh},
     * as this will not attempt to reload configuration when they are already
     * loaded into the object.
     */
    getSync() {
        if (this.needsRefresh()) {
            this.refreshSync();
            this.expired = false;
        }
    }
    /**
     * Refreshes the configuration. Users should call {get} before attempting
     * to forcibly refresh configuration.
     *
     * @note Subclasses should override this class to reset then
     *   configuration object and then call the callback with
     *   any error information.
     * @see get
     */
    refreshSync() {
        this.expired = false;
    }
}
exports.default = Configuration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnN0cmVhbXMtY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJzdHJlYW1zLWNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBOEI7QUFFOUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJCRztBQUNILE1BQXFCLGFBQWE7SUFjakM7Ozs7O09BS0c7SUFDSCxZQUFZLFNBQWMsRUFBRTtRQW5CNUIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixZQUFPLEdBQVksS0FBSyxDQUFDO1FBOEN6Qjs7O1dBR0c7UUFDSCxpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQS9CekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQWMsRUFBRTtRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUVwQiw0REFBNEQ7UUFDNUQsSUFBSSxNQUFNLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNuQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUMzQixDQUFDO1FBRUQ7WUFDQyxRQUFRO1lBQ1IsV0FBVztZQUNYLFNBQVM7WUFDVCxVQUFVO1lBQ1YsT0FBTztZQUNQLGtCQUFrQjtZQUNsQixtQkFBbUI7WUFDbkIsYUFBYTtZQUNiLFdBQVc7U0FDWCxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQVFEOzs7O09BSUc7SUFDSCxZQUFZO1FBQ1gsSUFBSSxXQUFXLEdBQUcsa0JBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDaEQsSUFBSSxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFcEUsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLFlBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDakUsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO2FBQU0sQ0FBQztZQUNQLElBQUksS0FBSyxHQUFHO2dCQUNYLFFBQVE7Z0JBQ1IsV0FBVztnQkFDWCxTQUFTO2dCQUNULFVBQVU7Z0JBQ1YsT0FBTztnQkFDUCxrQkFBa0I7Z0JBQ2xCLG1CQUFtQjtnQkFDbkIsYUFBYTtnQkFDYixXQUFXO2FBQ1gsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxhQUFhLElBQUksS0FBSyxLQUFLLFdBQVcsQ0FBQztZQUNoRixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMvQixDQUFDO0lBQ0YsQ0FBQztJQUVELFdBQVc7UUFDVixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixPQUFPO1lBQ04sTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUI7WUFDekMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztTQUN6QixDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBRUgsT0FBTztRQUNOLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLENBQUM7SUFDRixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFFSCxXQUFXO1FBQ1YsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztDQUNEO0FBOUhELGdDQThIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1dGlsIGZyb20gXCIuL2F3cy11dGlsXCI7XG5cbi8qKlxuICogUmVwcmVzZW50cyB5b3VyIFJTVFJFQU1TIGNvbmZpZ3VyYXRpb25cbiAqIENyZWF0aW5nIGEgYENvbmZpZ3VyYXRpb25gIG9iamVjdCBhbGxvd3MgeW91IHRvIHBhc3MgYXJvdW5kIHlvdXJcbiAqIGNvaW5maWcgaW5mb3JtYXRpb24gdG8gY29uZmlndXJhdGlvbiBhbmQgc2VydmljZSBvYmplY3RzLlxuICpcbiAqXG4gKiAjIyBFeHBpcmluZyBhbmQgUmVmcmVzaGluZyBDb25maWd1cmF0aW9uXG4gKlxuICogT2NjYXNpb25hbGx5IGNvbmZpZ3VyYXRpb24gY2FuIGV4cGlyZSBpbiB0aGUgbWlkZGxlIG9mIGEgbG9uZy1ydW5uaW5nXG4gKiBhcHBsaWNhdGlvbi4gSW4gdGhpcyBjYXNlLCB0aGUgU0RLIHdpbGwgYXV0b21hdGljYWxseSBhdHRlbXB0IHRvXG4gKiByZWZyZXNoIHRoZSBjb25maWd1cmF0aW9uIGZyb20gdGhlIHN0b3JhZ2UgbG9jYXRpb24gaWYgdGhlIENvbmZpZ3VyYXRpb25cbiAqIGNsYXNzIGltcGxlbWVudHMgdGhlIHtyZWZyZXNofSBtZXRob2QuXG4gKlxuICogSWYgeW91IGFyZSBpbXBsZW1lbnRpbmcgYSBjb25maWd1cmF0aW9uIHN0b3JhZ2UgbG9jYXRpb24sIHlvdVxuICogd2lsbCB3YW50IHRvIGNyZWF0ZSBhIHN1YmNsYXNzIG9mIHRoZSBgQ29uZmlndXJhdGlvbmAgY2xhc3MgYW5kXG4gKiBvdmVycmlkZSB0aGUge3JlZnJlc2h9IG1ldGhvZC4gVGhpcyBtZXRob2QgYWxsb3dzIGNvbmZpZ3VyYXRpb24gdG8gYmVcbiAqIHJldHJpZXZlZCBmcm9tIHRoZSBiYWNraW5nIHN0b3JlLCBiZSBpdCBhIGZpbGUgc3lzdGVtLCBkYXRhYmFzZSwgb3JcbiAqIHNvbWUgbmV0d29yayBzdG9yYWdlLiBUaGUgbWV0aG9kIHNob3VsZCByZXNldCB0aGUgY29uZmlndXJhdGlvbiBhdHRyaWJ1dGVzXG4gKiBvbiB0aGUgb2JqZWN0LlxuICpcbiAqIEAhYXR0cmlidXRlIGV4cGlyZWRcbiAqICAgQHJldHVybiBbQm9vbGVhbl0gd2hldGhlciB0aGUgY29uZmlndXJhdGlvbiBoYXZlIGJlZW4gZXhwaXJlZCBhbmRcbiAqICAgICByZXF1aXJlIGEgcmVmcmVzaC4gVXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIHtleHBpcmVUaW1lfS5cbiAqIEAhYXR0cmlidXRlIGV4cGlyZVRpbWVcbiAqICAgQHJldHVybiBbRGF0ZV0gYSB0aW1lIHdoZW4gY29uZmlndXJhdGlvbiBzaG91bGQgYmUgY29uc2lkZXJlZCBleHBpcmVkLiBVc2VkXG4gKiAgICAgaW4gY29uanVuY3Rpb24gd2l0aCB7ZXhwaXJlZH0uXG5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uZmlndXJhdGlvbiB7XG5cdGV4cGlyZVRpbWU6IG51bWJlciA9IDA7XG5cdGV4cGlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHRSZWdpb246IHN0cmluZztcblx0TGVvU3RyZWFtOiBzdHJpbmc7XG5cdExlb0V2ZW50OiBzdHJpbmc7XG5cdExlb1MzOiBzdHJpbmc7XG5cdExlb0tpbmVzaXNTdHJlYW06IHN0cmluZztcblx0TGVvRmlyZWhvc2VTdHJlYW06IHN0cmluZztcblx0TGVvU2V0dGluZ3M6IHN0cmluZztcblx0TGVvQ3Jvbjogc3RyaW5nO1xuXHRMZW9TeXN0ZW0/OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIEEgY29uZmlndXJhdGlvbiBvYmplY3QgY2FuIGJlIGNyZWF0ZWQgdXNpbmcgcG9zaXRpb25hbCBhcmd1bWVudHMgb3IgYW4gb3B0aW9uc1xuXHQgKiBoYXNoLlxuXHQgKlxuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihjb25maWc6IGFueSA9IHt9KSB7XG5cdFx0dGhpcy51cGRhdGUoY29uZmlnKTtcblx0fVxuXG5cdHVwZGF0ZShjb25maWc6IGFueSA9IHt9KSB7XG5cdFx0dGhpcy5leHBpcmVkID0gZmFsc2U7XG5cdFx0dGhpcy5leHBpcmVUaW1lID0gMDtcblxuXHRcdC8vIEdvdCB2ZXJib3NlIHN0eWxlIHNvIHN3aXRjaCBpdCB0byBqdXN0IHRoZSByZXNvdXJjZSBzdHlsZVxuXHRcdGlmIChjb25maWcuczMgJiYgY29uZmlnLnJlc291cmNlcykge1xuXHRcdFx0Y29uZmlnID0gY29uZmlnLnJlc291cmNlcztcblx0XHR9XG5cblx0XHRbXG5cdFx0XHRcIlJlZ2lvblwiLFxuXHRcdFx0XCJMZW9TdHJlYW1cIixcblx0XHRcdFwiTGVvQ3JvblwiLFxuXHRcdFx0XCJMZW9FdmVudFwiLFxuXHRcdFx0XCJMZW9TM1wiLFxuXHRcdFx0XCJMZW9LaW5lc2lzU3RyZWFtXCIsXG5cdFx0XHRcIkxlb0ZpcmVob3NlU3RyZWFtXCIsXG5cdFx0XHRcIkxlb1NldHRpbmdzXCIsXG5cdFx0XHRcIkxlb1N5c3RlbVwiXG5cdFx0XS5mb3JFYWNoKGZpZWxkID0+IHtcblx0XHRcdHRoaXNbZmllbGRdID0gY29uZmlnW2ZpZWxkXTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIFtJbnRlZ2VyXSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgYmVmb3JlIHtleHBpcmVUaW1lfSBkdXJpbmcgd2hpY2hcblx0ICogICB0aGUgY29uZmlndXJhdGlvbiB3aWxsIGJlIGNvbnNpZGVyZWQgZXhwaXJlZC5cblx0ICovXG5cdGV4cGlyeVdpbmRvdzogbnVtYmVyID0gMTU7XG5cblx0LyoqXG5cdCAqIEByZXR1cm4gW0Jvb2xlYW5dIHdoZXRoZXIgdGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHNob3VsZCBjYWxsIHtyZWZyZXNofVxuXHQgKiBAbm90ZSBTdWJjbGFzc2VzIHNob3VsZCBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byBwcm92aWRlIGN1c3RvbSByZWZyZXNoXG5cdCAqICAgbG9naWMuXG5cdCAqL1xuXHRuZWVkc1JlZnJlc2goKSB7XG5cdFx0bGV0IGN1cnJlbnRUaW1lID0gdXRpbC5kYXRlLmdldERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0bGV0IGFkanVzdGVkVGltZSA9IG5ldyBEYXRlKGN1cnJlbnRUaW1lICsgdGhpcy5leHBpcnlXaW5kb3cgKiAxMDAwKTtcblxuXHRcdGlmICh0aGlzLmV4cGlyZVRpbWUgJiYgYWRqdXN0ZWRUaW1lLnZhbHVlT2YoKSA+IHRoaXMuZXhwaXJlVGltZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCB2YWxpZCA9IFtcblx0XHRcdFx0XCJSZWdpb25cIixcblx0XHRcdFx0XCJMZW9TdHJlYW1cIixcblx0XHRcdFx0XCJMZW9Dcm9uXCIsXG5cdFx0XHRcdFwiTGVvRXZlbnRcIixcblx0XHRcdFx0XCJMZW9TM1wiLFxuXHRcdFx0XHRcIkxlb0tpbmVzaXNTdHJlYW1cIixcblx0XHRcdFx0XCJMZW9GaXJlaG9zZVN0cmVhbVwiLFxuXHRcdFx0XHRcIkxlb1NldHRpbmdzXCIsXG5cdFx0XHRcdFwiTGVvU3lzdGVtXCJcblx0XHRcdF0uZXZlcnkoZmllbGQgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpc1tmaWVsZF0gIT0gbnVsbCB8fCBmaWVsZCA9PT0gXCJMZW9TZXR0aW5nc1wiIHx8IGZpZWxkID09PSBcIkxlb1N5c3RlbVwiO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiB0aGlzLmV4cGlyZWQgfHwgIXZhbGlkO1xuXHRcdH1cblx0fVxuXG5cdHJlc29sdmVTeW5jKCkge1xuXHRcdHRoaXMuZ2V0U3luYygpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRSZWdpb246IHRoaXMuUmVnaW9uLFxuXHRcdFx0TGVvU3RyZWFtOiB0aGlzLkxlb1N0cmVhbSxcblx0XHRcdExlb0Nyb246IHRoaXMuTGVvQ3Jvbixcblx0XHRcdExlb0V2ZW50OiB0aGlzLkxlb0V2ZW50LFxuXHRcdFx0TGVvUzM6IHRoaXMuTGVvUzMsXG5cdFx0XHRMZW9LaW5lc2lzU3RyZWFtOiB0aGlzLkxlb0tpbmVzaXNTdHJlYW0sXG5cdFx0XHRMZW9GaXJlaG9zZVN0cmVhbTogdGhpcy5MZW9GaXJlaG9zZVN0cmVhbSxcblx0XHRcdExlb1NldHRpbmdzOiB0aGlzLkxlb1NldHRpbmdzLFxuXHRcdFx0TGVvU3lzdGVtOiB0aGlzLkxlb1N5c3RlbSxcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGV4aXN0aW5nIGNvbmZpZ3VyYXRpb24sIHJlZnJlc2hpbmcgdGhlbSBpZiB0aGV5IGFyZSBub3QgeWV0IGxvYWRlZFxuXHQgKiBvciBoYXZlIGV4cGlyZWQuIFVzZXJzIHNob3VsZCBjYWxsIHRoaXMgbWV0aG9kIGJlZm9yZSB1c2luZyB7cmVmcmVzaH0sXG5cdCAqIGFzIHRoaXMgd2lsbCBub3QgYXR0ZW1wdCB0byByZWxvYWQgY29uZmlndXJhdGlvbiB3aGVuIHRoZXkgYXJlIGFscmVhZHlcblx0ICogbG9hZGVkIGludG8gdGhlIG9iamVjdC5cblx0ICovXG5cblx0Z2V0U3luYygpIHtcblx0XHRpZiAodGhpcy5uZWVkc1JlZnJlc2goKSkge1xuXHRcdFx0dGhpcy5yZWZyZXNoU3luYygpO1xuXHRcdFx0dGhpcy5leHBpcmVkID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJlZnJlc2hlcyB0aGUgY29uZmlndXJhdGlvbi4gVXNlcnMgc2hvdWxkIGNhbGwge2dldH0gYmVmb3JlIGF0dGVtcHRpbmdcblx0ICogdG8gZm9yY2libHkgcmVmcmVzaCBjb25maWd1cmF0aW9uLlxuXHQgKlxuXHQgKiBAbm90ZSBTdWJjbGFzc2VzIHNob3VsZCBvdmVycmlkZSB0aGlzIGNsYXNzIHRvIHJlc2V0IHRoZW5cblx0ICogICBjb25maWd1cmF0aW9uIG9iamVjdCBhbmQgdGhlbiBjYWxsIHRoZSBjYWxsYmFjayB3aXRoXG5cdCAqICAgYW55IGVycm9yIGluZm9ybWF0aW9uLlxuXHQgKiBAc2VlIGdldFxuXHQgKi9cblxuXHRyZWZyZXNoU3luYygpIHtcblx0XHR0aGlzLmV4cGlyZWQgPSBmYWxzZTtcblx0fVxufVxuXG4iXX0=