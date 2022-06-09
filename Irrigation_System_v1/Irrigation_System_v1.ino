#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Arduino_JSON.h>

WiFiClient wifiClient;
 
const char* ssid = "brisa-1658937";
const char* password = "og8zgvoz";

int i=0;
 
void setup () {
 
  Serial.begin(115200);
  pinMode(13, OUTPUT);
  
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
 
    delay(1000);
    Serial.print("Connecting..");
 
  }
 
}
 
void loop() {
 
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
 
      JSONVar myObject = JSON.parse(HttpGetData());

      if (JSON.typeof(myObject) == "undefined") {
        Serial.println("Parsing input failed!");
        return;
      }
      if(myObject["led_status"]){
         digitalWrite(13, HIGH);
      }else{
         digitalWrite(13, LOW);
          
      }

      delay(1000);

      String data = String(i);

      HttpPostData(data);

      i= i+1;
     
  }
 

 
  delay(1000);    //Send a request every 30 seconds
}

String HttpGetData(){
  
  HTTPClient http;  //Declare an object of class HTTPClient
  
  http.begin(wifiClient ,"http://192.168.0.56:3000/devices/001");  //Specify request destination
  int httpCode = http.GET();                                  //Send the request
  if (httpCode > 0) {                     //Check the returning code
    String payload = http.getString();    //Get the request response payload
    Serial.println(payload);              //Print the response payload
    http.end();                           //Close connection
    return payload;
  }
}


void HttpPostData(String data){
  
  HTTPClient http;
      
      // Your Domain name with URL path or IP address with path
      http.begin(wifiClient, "http://192.168.0.56:3000/devices/001");

      // Specify content-type header
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      // Data to send with HTTP POST
      String httpRequestData = "data="+data;           
      // Send HTTP POST request
      int httpResponseCode = http.PATCH(httpRequestData);
     
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      http.end(); 

}
