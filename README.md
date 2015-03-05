[![Dependency Status](https://david-dm.org/ddm/s3ssm.svg?theme=shields.io)](https://david-dm.org/ddm/s3ssm)

Install
-------

    npm install s3ssm -g

Use
---

Linux, OSX etc:

    s3ssm --help

Windows:

    s3ssm.cmd --help

Configuration
-------------

Typically your configuration (`./config.json` by default) will look like:

    {
        "accessKeyId": "MyAccessKeyId",
        "secretAccessKey": "MySecretAccessKey",
        "region": "eu-west-1"
    }

See the [AWS documentation]( http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_Disk).
