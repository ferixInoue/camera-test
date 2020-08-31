import Paho from 'paho-mqtt'
import CryptoJS from 'crypto-js'
import moment from 'moment'
const AWS = require('aws-sdk')

class MqttClient {
  endpoint = ''
  topic = ''
  region = ''
  poolId = ''
  constructor(endpoint, topic, region, poolId) {
    this.endpoint = endpoint
    this.topic = topic
    this.region = region
    this.poolId = poolId
  }

  getCredentials() {
    AWS.config.region = this.region
    const cognitoidentity = new AWS.CognitoIdentity()
    const params = {
      IdentityPoolId: this.poolId,
    }
    cognitoidentity.getId(params, function (err, objectHavingIdentityId) {
      if (err) return err
      cognitoidentity.getCredentialsForIdentity(
        objectHavingIdentityId,
        function (err, data) {
          if (err) return err
          const credentials = {
            accessKey: data.Credentials.AccessKeyId,
            secretKey: data.Credentials.SecretKey,
            sessionToken: data.Credentials.SessionToken,
          }
          console.log(
            'CognitoIdentity has provided temporary credentials successfully.'
          )
          return credentials
        }
      )
    })
  }

  getEndpoint() {
    getCredentials(poolId, region, function (err, creds) {
      if (err) return done(err)

      done(null, wssEndpoint)

      const clientId = Math.random().toString(36).substring(7)
      client = new Paho.Client(endpoint, clientId)
      const connectOptions = {
        useSSL: true,
        timeout: 3,
        mqttVersion: 4,
        onSuccess: subscribe,
      }
      client.connect(connectOptions)
      client.onMessageArrived = onMessage
      client.onConnectionLost = function (e) {
        console.log(e)
      }
    })
  }

  initialize() {}
}

function SigV4Utils() {}

SigV4Utils.sign = function (key, msg) {
  const hash = CryptoJS.HmacSHA256(msg, key)
  return hash.toString(CryptoJS.enc.Hex)
}

SigV4Utils.sha256 = function (msg) {
  const hash = CryptoJS.SHA256(msg)
  return hash.toString(CryptoJS.enc.Hex)
}

SigV4Utils.getSignatureKey = function (
  key,
  dateStamp,
  regionName,
  serviceName
) {
  const kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key)
  const kRegion = CryptoJS.HmacSHA256(regionName, kDate)
  const kService = CryptoJS.HmacSHA256(serviceName, kRegion)
  const kSigning = CryptoJS.HmacSHA256('aws4_request', kService)
  return kSigning
}

// function getCredentials(poolId, region, done) {
//   AWS.config.region = region
//   const cognitoidentity = new AWS.CognitoIdentity()
//   const params = {
//     IdentityPoolId: poolId,
//   }
//   cognitoidentity.getId(params, function (err, objectHavingIdentityId) {
//     if (err) return done(err)
//     cognitoidentity.getCredentialsForIdentity(objectHavingIdentityId, function (
//       err,
//       data
//     ) {
//       if (err) return done(err)
//       const credentials = {
//         accessKey: data.Credentials.AccessKeyId,
//         secretKey: data.Credentials.SecretKey,
//         sessionToken: data.Credentials.SessionToken,
//       }
//       console.log(
//         'CognitoIdentity has provided temporary credentials successfully.'
//       )
//       done(null, credentials)
//     })
//   })
// }

function getEndpoint(region, awsIotEndpoint, poolId, done) {
  getCredentials(poolId, region, function (err, creds) {
    if (err) return done(err)

    done(null, wssEndpoint)
  })
}
const data = {
  messages: [],
}
let client

function subscribe() {
  client.subscribe(topic)
  console.log('subscribed')
}

function send(content) {
  const message = new Paho.Message(content)
  message.destinationName = topic
  client.send(message)
  console.log('sent')
}

function onMessage(message) {
  data.messages.push(message.payloadString)
  console.log('message received: ' + message.payloadString)
}

getEndpoint(region, endpoint, poolId, function (err, endpoint) {
  if (err) {
    console.log('failed', err)
    return
  }
  const clientId = Math.random().toString(36).substring(7)
  client = new Paho.Client(endpoint, clientId)
  const connectOptions = {
    useSSL: true,
    timeout: 3,
    mqttVersion: 4,
    onSuccess: subscribe,
  }
  client.connect(connectOptions)
  client.onMessageArrived = onMessage
  client.onConnectionLost = function (e) {
    console.log(e)
  }
})

export { send, onMessage, subscribe, getEndpoint }
