/* MagicMirror²
 * Node Helper: MMM-DynamicSnow
 * 
 * By Christian Gillinger
 * MIT Licensed.
 *
 * v3.0.1 (2024-12-27)
 * Added file watching and dynamic keyword loading capabilities
 */

const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");

module.exports = NodeHelper.create({
    /**
     * Initialize the node helper
     */
    start: function() {
        console.log("Starting node helper for: " + this.name);
        this.loadKeywords();
    },

    /**
     * Load keywords from snowKeywords.json
     * Implements file watching for live updates
     */
    loadKeywords: function() {
        const keywordsPath = path.join(__dirname, "snowKeywords.json");
        
        try {
            // Initial load of keywords
            this.readAndSendKeywords(keywordsPath);
            
            // Watch for file changes
            fs.watch(keywordsPath, (eventType) => {
                if (eventType === "change") {
                    console.log("MMM-DynamicSnow: snowKeywords.json changed, reloading...");
                    this.readAndSendKeywords(keywordsPath);
                }
            });
        } catch (err) {
            console.error("MMM-DynamicSnow: Error setting up keyword monitoring:", err);
            // Send default keywords if file operations fail
            this.sendSocketNotification("SNOW_KEYWORDS_LOADED", [
                "snow", "sleet", "blizzard", "flurries"
            ]);
        }
    },

    /**
     * Read keywords from file and send to module
     * @param {string} filePath - Path to snowKeywords.json
     */
    readAndSendKeywords: function(filePath) {
        try {
            const data = fs.readFileSync(filePath, "utf8");
            const keywords = JSON.parse(data);
            
            if (Array.isArray(keywords.snowKeywords)) {
                this.sendSocketNotification("SNOW_KEYWORDS_LOADED", keywords.snowKeywords);
                console.log("MMM-DynamicSnow: Successfully loaded keywords:", keywords.snowKeywords);
            } else {
                throw new Error("Invalid keywords format");
            }
        } catch (err) {
            console.error("MMM-DynamicSnow: Error reading keywords:", err);
            // Send default keywords on error
            this.sendSocketNotification("SNOW_KEYWORDS_LOADED", [
                "snow", "sleet", "blizzard", "flurries"
            ]);
        }
    },
    
    /**
     * Handle socket notifications from the module
     * @param {string} notification - The notification identifier
     * @param {any} payload - The notification payload
     */
    socketNotificationReceived: function(notification, payload) {
        if (notification === "REQUEST_KEYWORDS") {
            this.loadKeywords();
        }
    }
});
