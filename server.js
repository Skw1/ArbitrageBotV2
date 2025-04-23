const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const zlib = require('zlib'); // для распаковки бинарных данных, если они сжаты

const PORT = 3000;
const app = express();
