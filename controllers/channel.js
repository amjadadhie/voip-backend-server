const ami = require("./asterisk");

function createChannel(channelName, members) {
    members.forEach((member) => {
        ami.action({
            Action: "Originate",
            Channel: `PJSIP/${member}`,
            Context: "default",
            Exten: channelName,
            Priority: 1,
            CallerID: "Group Call"
        });
    });

    console.log(`✅ Group call started: ${channelName}`);
}

module.exports = createChannel;
