const telematics = require("../services/apis/agintegrated-telematics");
const STEP = "Get List of Files URIs";

async function getListOfFiles(lastExecutionTime, params, services) {
  const { config, logger, couchbase, retry } = services;

  let listOfFilesOfAllNodes = [];
  try {
    //Get Avaliable telematic node for this stub user
    let telematicNodes = await telematics.ListAvailableTelematics(
      params.agIntegratedStubKey,
      services
    );

    // For each node
    //get list of files
    //send it to SQS
    let listOfFiles;

    const TRUE = "t";

    for (let i = 0; i < telematicNodes.length; i++) {
      if (
        telematicNodes[i].file_read === TRUE &&
        telematicNodes[i].telematics_node_id
      ) {
        nodeId = telematicNodes[i].telematics_node_id;
        params.nodeId = nodeId;

        //get list of files
        listOfFiles = await telematics.ListAvailableFilesFromTelematicNode(
          nodeId,
          params.startDateTime,
          lastExecutionTime,
          params.agIntegratedStubKey,
          config
        );

        listOfFiles.map(function(entry) {
          entry.nodeId = nodeId;
        });

        if (listOfFiles) {
          listOfFilesOfAllNodes.push(...listOfFiles);
        }
      }
    }
  } catch (exception) {
    logger.logError(exception, STEP, params);
    throw exception;
  }

  return listOfFilesOfAllNodes;
}

module.exports = getListOfFiles;
