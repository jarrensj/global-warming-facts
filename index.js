/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

const SKILL_NAME = 'global warming facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a global warming fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const FALLBACK_MESSAGE = 'The global warming Facts skill can\'t help you with that.  It can help you discover facts about global warming if you say tell me a global warming fact. What can I help you with?';
const FALLBACK_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/lambda/data
//=========================================================================================================================================

const data = [
  'Global warming is real and is backed by scientific evidence but many people choose to not believe or take action.',
  'Many people deny that global warming is real even though there is scientific evidence that global warming is real.',
  'A big culprit of global warming and the depletion of earth\'s resources is shortsightedness for monetary gains',
  'The "greenhouse effect" is will make the Earth warmer and that includes the oceans as well as melting the glaciers.',
  'Carbon dioxide and other greenhouse gases are causing the Earth to get warmer',
  'Ice is melting due to the temperature rising and the sea level is rising because of it.',
  'Climate change is a global problem.',
  'Global warming affects the supply of clean water. Fresh drinking water is indispensible for human life. Many people in poverty already experience water poverty.',
  'The poor are hurt the most by global warming.',
  'There are many effects of global warming which are not limited to global temperature rising, warming of the oceans, glaciers melting, sea levels rising, more intense events, and acidification of the ocean.',
  'There is an encyclical on the environment and it is called, "Laudato Si", urging everyone to work together to protect our planet.'
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const randomFact = getRandomItem(data);
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.
  //              This handler will not be triggered except in that locale, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE)
      .reprompt(FALLBACK_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

function getRandomItem(arrayOfItems) {
  // can take an array, or a dictionary
  if (Array.isArray(arrayOfItems)) {
    // the argument is an array []
    let i = 0;
    i = Math.floor(Math.random() * arrayOfItems.length);
    return (arrayOfItems[i]);
  }

  if (typeof arrayOfItems === 'object') {
    // argument is object, treat as dictionary
    const result = {};
    const key = this.getRandomItem(Object.keys(arrayOfItems));
    result[key] = arrayOfItems[key];
    return result;
  }
  // not an array or object, so just return the input
  return arrayOfItems;
}
