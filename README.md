# TaiwanReservoirAPI

**台灣水庫資訊 API**

[![Build Status](https://travis-ci.org/washwashsleep/TaiwanReservoirAPI.svg?branch=master)](https://travis-ci.org/washwashsleep/TaiwanReservoirAPI)

# Online API endpoint

http://128.199.223.114:10080/

# 參數說明

| 參數名稱 | 說明  |
|---|---|
| reservoirName  |  水庫名稱  |
| baseAvailable  | 有效容量(萬立方公尺)  |
| daliyTime  |  每日統計時間 |
| daliyRainfall  |  每日集水區降雨量(毫米) |
| daliyInflow  |  每日進水量(萬立方公尺) |
| daliyOverflow  |  每日出水量(萬立方公尺)|
| daliyDetector  |  與昨日水位差(公尺)|
| concentration  |  水體核種濃度值|
| immediateTime  |  即時水情時間|
| immediateLevel  |  即時水位(公尺)|
| immediateStorage  |  即時有效蓄水量(萬立方公尺)|
| immediatePercentage  |  即時蓄水量百分比(%)|

# How to use

## Clone

**Open your terminal**

`git clone https://github.com/washwashsleep/TaiwanReservoirAPI.git`

**And then go to TaiwanReservoirAPI folder**

`cd TaiwanReservoirAPI/`


## Install

**Install Node modules**

`npm install`

## start

**Start this api**

`node app.js`

## See result

**Open your browser and type**

`http://127.0.0.1:10080/`
