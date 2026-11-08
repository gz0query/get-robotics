import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBZS5JSKfClwCMHErjYoJ6dVJLTSyKLeuk",
  authDomain: "clone-5ef88.firebaseapp.com",
  projectId: "clone-5ef88",
  storageBucket: "clone-5ef88.firebasestorage.app",
  messagingSenderId: "739261013820",
  appId: "1:739261013820:web:ab253671a834068a5c0839",
  measurementId: "G-D6EKVSQX6F"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(() => {
  "use strict";

  const projects = {
    stick: {
      title: "Smart Blind Walking Stick",
      filename: "smart_blind_walking_stick",
      image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
      wiring: {
        arduino: "HC-SR04: TRIG → D9, ECHO → D10; buzzer + → D8, − → GND. Sensor VCC → 5V, GND → GND.",
        esp32: "HC-SR04: TRIG → GPIO 5, ECHO → GPIO 18 (use a voltage divider on ECHO); buzzer signal → GPIO 19. Power sensor and buzzer appropriately; share GND."
      },
      code: {
        arduino: String.raw`const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int BUZZER_PIN = 8;
const int ALERT_DISTANCE_CM = 50;

unsigned long lastBeepTime = 0;

long measureDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  const unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000UL);
  if (duration == 0) {
    return -1;
  }
  return static_cast<long>(duration * 0.0343 / 2.0);
}

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  Serial.begin(9600);
}

void loop() {
  const long distanceCm = measureDistanceCm();
  Serial.print(F("Distance: "));
  Serial.print(distanceCm);
  Serial.println(F(" cm"));

  if (distanceCm > 0 && distanceCm <= ALERT_DISTANCE_CM) {
    const unsigned int beepInterval = static_cast<unsigned int>(
      map(distanceCm, 1, ALERT_DISTANCE_CM, 80, 500)
    );
    if (millis() - lastBeepTime >= beepInterval) {
      lastBeepTime = millis();
      digitalWrite(BUZZER_PIN, HIGH);
      delay(45);
      digitalWrite(BUZZER_PIN, LOW);
    }
  } else {
    digitalWrite(BUZZER_PIN, LOW);
  }
  delay(25);
}`,
        esp32: String.raw`const int TRIG_PIN = 5;
const int ECHO_PIN = 18;
const int BUZZER_PIN = 19;
const int ALERT_DISTANCE_CM = 50;

unsigned long lastBeepTime = 0;

long measureDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  const unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000UL);
  if (duration == 0) {
    return -1;
  }
  return static_cast<long>(duration * 0.0343 / 2.0);
}

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  Serial.begin(115200);
}

void loop() {
  const long distanceCm = measureDistanceCm();
  Serial.print("Distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  if (distanceCm > 0 && distanceCm <= ALERT_DISTANCE_CM) {
    const unsigned int beepInterval = static_cast<unsigned int>(
      map(distanceCm, 1, ALERT_DISTANCE_CM, 80, 500)
    );
    if (millis() - lastBeepTime >= beepInterval) {
      lastBeepTime = millis();
      digitalWrite(BUZZER_PIN, HIGH);
      delay(45);
      digitalWrite(BUZZER_PIN, LOW);
    }
  } else {
    digitalWrite(BUZZER_PIN, LOW);
  }
  delay(25);
}`
      }
    },
    "motor-car": {
      title: "Autonomous Motor Robot Car",
      filename: "autonomous_motor_robot_car",
      image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=800&q=80",
      wiring: {
        arduino: "L298N: ENA → D5, IN1 → D6, IN2 → D7, IN3 → D8, IN4 → D9, ENB → D10. HC-SR04: TRIG → A0, ECHO → A1. Join controller and driver grounds.",
        esp32: "L298N: IN1 → GPIO 26, IN2 → GPIO 27, IN3 → GPIO 14, IN4 → GPIO 12; keep ENA/ENB enable jumpers installed. HC-SR04: TRIG → GPIO 5, ECHO → GPIO 18 through a voltage divider. Use a motor supply and common GND."
      },
      code: {
        arduino: String.raw`const int ENA = 5;
const int IN1 = 6;
const int IN2 = 7;
const int IN3 = 8;
const int IN4 = 9;
const int ENB = 10;
const int TRIG_PIN = A0;
const int ECHO_PIN = A1;
const int OBSTACLE_DISTANCE_CM = 25;

long measureDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  const unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000UL);
  if (duration == 0) {
    return 999;
  }
  return static_cast<long>(duration * 0.0343 / 2.0);
}

void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, 170);
  analogWrite(ENB, 170);
}

void moveBackward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  analogWrite(ENA, 170);
  analogWrite(ENB, 170);
}

void turnRight() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  analogWrite(ENA, 165);
  analogWrite(ENB, 165);
}

void stopCar() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);
}

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENB, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
  stopCar();
}

void loop() {
  const long distanceCm = measureDistanceCm();
  Serial.print(F("Distance: "));
  Serial.print(distanceCm);
  Serial.println(F(" cm"));

  if (distanceCm <= OBSTACLE_DISTANCE_CM) {
    stopCar();
    delay(200);
    moveBackward();
    delay(350);
    stopCar();
    delay(150);
    turnRight();
    delay(450);
    stopCar();
    delay(100);
  } else {
    moveForward();
  }
  delay(40);
}`,
        esp32: String.raw`const int IN1 = 26;
const int IN2 = 27;
const int IN3 = 14;
const int IN4 = 12;
const int TRIG_PIN = 5;
const int ECHO_PIN = 18;
const int OBSTACLE_DISTANCE_CM = 25;

long measureDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  const unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000UL);
  if (duration == 0) {
    return 999;
  }
  return static_cast<long>(duration * 0.0343 / 2.0);
}

void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void moveBackward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void turnRight() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void stopCar() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(115200);
  stopCar();
}

void loop() {
  const long distanceCm = measureDistanceCm();
  Serial.print("Distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  if (distanceCm <= OBSTACLE_DISTANCE_CM) {
    stopCar();
    delay(200);
    moveBackward();
    delay(350);
    stopCar();
    delay(150);
    turnRight();
    delay(450);
    stopCar();
    delay(100);
  } else {
    moveForward();
  }
  delay(40);
}`
      }
    },
    "wifi-car": {
      title: "Wi-Fi Controlled Robot Car",
      filename: "wifi_controlled_robot_car",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      wiring: {
        arduino: "L298N: ENA → D5, IN1 → D6, IN2 → D7, IN3 → D8, IN4 → D9, ENB → D10. HC-05/HC-06 TX → D2, RX ← D3 (use a divider on module RX); share GND.",
        esp32: "L298N: IN1 → GPIO 26, IN2 → GPIO 27, IN3 → GPIO 14, IN4 → GPIO 12; keep ENA/ENB enable jumpers installed. Power motors separately and join grounds. Join the GetRobotics_Car Wi-Fi network."
      },
      code: {
        arduino: String.raw`#include <SoftwareSerial.h>

const int ENA = 5;
const int IN1 = 6;
const int IN2 = 7;
const int IN3 = 8;
const int IN4 = 9;
const int ENB = 10;
const int WIRELESS_RX_PIN = 2;
const int WIRELESS_TX_PIN = 3;

SoftwareSerial wirelessSerial(WIRELESS_RX_PIN, WIRELESS_TX_PIN);

void stopCar() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);
}

void setDrive(int leftForward, int rightForward) {
  digitalWrite(IN1, leftForward ? HIGH : LOW);
  digitalWrite(IN2, leftForward ? LOW : HIGH);
  digitalWrite(IN3, rightForward ? HIGH : LOW);
  digitalWrite(IN4, rightForward ? LOW : HIGH);
  analogWrite(ENA, 180);
  analogWrite(ENB, 180);
}

void moveForward() {
  setDrive(1, 1);
}

void moveBackward() {
  setDrive(0, 0);
}

void turnLeft() {
  setDrive(0, 1);
}

void turnRight() {
  setDrive(1, 0);
}

void handleCommand(char command) {
  switch (command) {
    case 'F':
      moveForward();
      break;
    case 'B':
      moveBackward();
      break;
    case 'L':
      turnLeft();
      break;
    case 'R':
      turnRight();
      break;
    case 'S':
    default:
      stopCar();
      break;
  }
}

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENB, OUTPUT);
  Serial.begin(9600);
  wirelessSerial.begin(9600);
  stopCar();
  Serial.println(F("Ready for F, B, L, R, S wireless serial commands."));
}

void loop() {
  while (wirelessSerial.available() > 0) {
    const char command = static_cast<char>(wirelessSerial.read());
    handleCommand(command);
    Serial.print(F("Command: "));
    Serial.println(command);
  }
}`,
        esp32: String.raw`#include <WiFi.h>
#include <WebServer.h>

const char *SSID = "GetRobotics_Car";
const char *PASSWORD = "12345678";
const int IN1 = 26;
const int IN2 = 27;
const int IN3 = 14;
const int IN4 = 12;

WebServer server(80);

const char controllerPage[] PROGMEM = R"rawliteral(
<!doctype html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Get Robotics Car Controller</title>
  <style>
    body{margin:0;padding:24px;background:#070b14;color:#f8fafc;font-family:Arial,sans-serif;text-align:center}
    h1{color:#00f0ff}main{max-width:380px;margin:24px auto;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    button{min-height:72px;border:1px solid #00f0ff;border-radius:12px;background:#111827;color:#00f0ff;font-size:18px;font-weight:bold}
    button:active{background:#00f0ff;color:#070b14}.stop{grid-column:2;background:#63242a;border-color:#ff6577;color:#fff}
    .hint{color:#94a3b8}
  </style>
</head>
<body>
  <h1>Get Robotics</h1>
  <p>Wi-Fi Robot Car Controller</p>
  <main>
    <span></span><button onclick="sendCommand('F')">Forward</button><span></span>
    <button onclick="sendCommand('L')">Left</button><button class="stop" onclick="sendCommand('S')">Stop</button><button onclick="sendCommand('R')">Right</button>
    <span></span><button onclick="sendCommand('B')">Backward</button><span></span>
  </main>
  <p class="hint" id="status">Connect to the robot's Wi-Fi network to drive.</p>
  <script>
    function sendCommand(command){
      fetch('/' + command).then(function(response){
        document.getElementById('status').textContent = response.ok ? 'Command sent: ' + command : 'Command failed.';
      }).catch(function(){
        document.getElementById('status').textContent = 'Could not reach the robot.';
      });
    }
    document.addEventListener('visibilitychange', function(){
      if(document.hidden){sendCommand('S');}
    });
  </script>
</body>
</html>
)rawliteral";

void stopCar() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void setDrive(bool leftForward, bool rightForward) {
  digitalWrite(IN1, leftForward ? HIGH : LOW);
  digitalWrite(IN2, leftForward ? LOW : HIGH);
  digitalWrite(IN3, rightForward ? HIGH : LOW);
  digitalWrite(IN4, rightForward ? LOW : HIGH);
}

void moveForward() {
  setDrive(true, true);
}

void moveBackward() {
  setDrive(false, false);
}

void turnLeft() {
  setDrive(false, true);
}

void turnRight() {
  setDrive(true, false);
}

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  Serial.begin(115200);
  stopCar();

  WiFi.mode(WIFI_AP);
  if (!WiFi.softAP(SSID, PASSWORD)) {
    Serial.println("Could not start Wi-Fi access point.");
    while (true) {
      delay(1000);
    }
  }

  server.on("/", HTTP_GET, []() {
    server.send_P(200, "text/html", controllerPage);
  });
  server.on("/F", HTTP_GET, []() {
    moveForward();
    server.send(200, "text/plain", "Forward");
  });
  server.on("/B", HTTP_GET, []() {
    moveBackward();
    server.send(200, "text/plain", "Backward");
  });
  server.on("/L", HTTP_GET, []() {
    turnLeft();
    server.send(200, "text/plain", "Left");
  });
  server.on("/R", HTTP_GET, []() {
    turnRight();
    server.send(200, "text/plain", "Right");
  });
  server.on("/S", HTTP_GET, []() {
    stopCar();
    server.send(200, "text/plain", "Stop");
  });
  server.onNotFound([]() {
    stopCar();
    server.send(404, "text/plain", "Unknown command");
  });
  server.begin();

  Serial.print("Connect to ");
  Serial.print(SSID);
  Serial.print(" and open http://");
  Serial.println(WiFi.softAPIP());
}

void loop() {
  server.handleClient();
}`
      }
    },
    laser: {
      title: "Laser Obstacle Detector",
      filename: "laser_obstacle_detector",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      wiring: {
        arduino: "KY-008 signal → D7; LDR voltage-divider output → A0; buzzer + → D8; alarm LED anode through a resistor → D13. Power the sensor and share GND.",
        esp32: "Laser signal → GPIO 23; LDR voltage-divider output → GPIO 34 (ADC); buzzer signal → GPIO 19; alarm LED anode through a resistor → GPIO 2. Keep ESP32 inputs at 3.3V."
      },
      code: {
        arduino: String.raw`const int LASER_PIN = 7;
const int LDR_SENSOR_PIN = A0;
const int BUZZER_PIN = 8;
const int ALARM_LED_PIN = 13;
const int LASER_THRESHOLD = 600;

void setup() {
  pinMode(LASER_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(ALARM_LED_PIN, OUTPUT);
  digitalWrite(LASER_PIN, HIGH);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(ALARM_LED_PIN, LOW);
  Serial.begin(9600);
}

void loop() {
  const int lightLevel = analogRead(LDR_SENSOR_PIN);
  const bool beamBlocked = lightLevel < LASER_THRESHOLD;

  digitalWrite(BUZZER_PIN, beamBlocked ? HIGH : LOW);
  digitalWrite(ALARM_LED_PIN, beamBlocked ? HIGH : LOW);
  Serial.print(F("LDR: "));
  Serial.print(lightLevel);
  Serial.println(beamBlocked ? F(" - BEAM BLOCKED") : F(" - Beam clear"));
  delay(50);
}`,
        esp32: String.raw`const int LASER_PIN = 23;
const int LDR_SENSOR_PIN = 34;
const int BUZZER_PIN = 19;
const int ALARM_LED_PIN = 2;
const int LASER_THRESHOLD = 2200;

void setup() {
  pinMode(LASER_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(ALARM_LED_PIN, OUTPUT);
  analogReadResolution(12);
  digitalWrite(LASER_PIN, HIGH);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(ALARM_LED_PIN, LOW);
  Serial.begin(115200);
}

void loop() {
  const int lightLevel = analogRead(LDR_SENSOR_PIN);
  const bool beamBlocked = lightLevel < LASER_THRESHOLD;

  digitalWrite(BUZZER_PIN, beamBlocked ? HIGH : LOW);
  digitalWrite(ALARM_LED_PIN, beamBlocked ? HIGH : LOW);
  Serial.print("LDR: ");
  Serial.print(lightLevel);
  Serial.println(beamBlocked ? " - BEAM BLOCKED" : " - Beam clear");
  delay(50);
}`
      }
    },
    leds: {
      title: "Breadboard Multi-LED Array",
      filename: "breadboard_multi_led_array",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
      wiring: {
        arduino: "Connect each LED anode through its own 220Ω resistor to D2, D3, D4, D5, or D6. Connect all cathodes to GND; use a shared breadboard ground rail.",
        esp32: "Connect each LED anode through its own 220Ω resistor to GPIO 13, 12, 14, 27, or 26. Connect all cathodes to GND; ESP32 GPIO is 3.3V."
      },
      code: {
        arduino: String.raw`const int ledPins[] = {2, 3, 4, 5, 6};
const int totalLeds = 5;
const unsigned int stepDelayMs = 120;

void allLedsOff() {
  for (int i = 0; i < totalLeds; i++) {
    digitalWrite(ledPins[i], LOW);
  }
}

void setup() {
  for (int i = 0; i < totalLeds; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
  allLedsOff();
}

void loop() {
  for (int i = 0; i < totalLeds; i++) {
    allLedsOff();
    digitalWrite(ledPins[i], HIGH);
    delay(stepDelayMs);
  }

  for (int i = totalLeds - 1; i >= 0; i--) {
    allLedsOff();
    digitalWrite(ledPins[i], HIGH);
    delay(stepDelayMs);
  }

  for (int flash = 0; flash < 3; flash++) {
    for (int i = 0; i < totalLeds; i++) {
      digitalWrite(ledPins[i], HIGH);
    }
    delay(250);
    allLedsOff();
    delay(250);
  }
}`,
        esp32: String.raw`const int ledPins[] = {13, 12, 14, 27, 26};
const int totalLeds = 5;
const unsigned int stepDelayMs = 120;

void allLedsOff() {
  for (int i = 0; i < totalLeds; i++) {
    digitalWrite(ledPins[i], LOW);
  }
}

void setup() {
  for (int i = 0; i < totalLeds; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
  allLedsOff();
}

void loop() {
  for (int i = 0; i < totalLeds; i++) {
    allLedsOff();
    digitalWrite(ledPins[i], HIGH);
    delay(stepDelayMs);
  }

  for (int i = totalLeds - 1; i >= 0; i--) {
    allLedsOff();
    digitalWrite(ledPins[i], HIGH);
    delay(stepDelayMs);
  }

  for (int flash = 0; flash < 3; flash++) {
    for (int i = 0; i < totalLeds; i++) {
      digitalWrite(ledPins[i], HIGH);
    }
    delay(250);
    allLedsOff();
    delay(250);
  }
}`
      }
    },
    "smart-waste-bin": {
      title: "Smart Waste Bin",
      filename: "smart_waste_bin",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      wiring: {
        arduino: "HC-SR04: TRIG → D9, ECHO → D10; servo signal → D6. Power the sensor and servo appropriately and connect grounds.",
        esp32: "HC-SR04: TRIG → GPIO 5, ECHO → GPIO 18 through a voltage divider; servo signal → GPIO 13. Power the sensor and servo appropriately and connect grounds."
      },
      code: {
        arduino: String.raw`// Smart Waste Bin - Arduino Uno Code
#include <Servo.h>

Servo lidServo;
const int trigPin = 9;
const int echoPin = 10;
const int servoPin = 6;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  lidServo.attach(servoPin);
  lidServo.write(0); // Lid closed initially
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;

  if (distance > 0 && distance <= 25) {
    lidServo.write(90); // Open lid
    delay(3000);        // Keep open for 3 seconds
    lidServo.write(0);  // Close lid
    delay(1000);
  }
  delay(100);
}`,
        esp32: String.raw`// Smart Waste Bin - ESP32 Code
#include <ESP32Servo.h>

Servo lidServo;
const int trigPin = 5;
const int echoPin = 18;
const int servoPin = 13;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  lidServo.attach(servoPin);
  lidServo.write(0); // Lid closed initially
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;

  if (distance > 0 && distance <= 25) {
    lidServo.write(90); // Open lid
    delay(3000);        // Keep open for 3 seconds
    lidServo.write(0);  // Close lid
    delay(1000);
  }
  delay(100);
}`
      }
    }
  };

  const factoryProjects = JSON.parse(JSON.stringify(projects));
  const aliases = {
    "blind-walking-stick": "stick",
    "smart-robot-car": "motor-car",
    "wifi-robot-car": "wifi-car",
    "laser-obstacle-detector": "laser",
    "breadboard-led-lights": "leds"
  };

  const modal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-project-title");
  const closeButton = document.getElementById("btn-close-modal");
  const codeDisplay = document.getElementById("code-display");
  const filenameDisplay = document.getElementById("code-filename");
  const activeBoardBadge = document.getElementById("active-board-badge");
  const copyButton = document.getElementById("btn-copy-code");
  const copyButtonText = document.getElementById("copy-btn-text");
  const replaceButton = document.getElementById("btn-open-replace-code");
  const keyGatePanel = document.getElementById("key-gate-panel");
  const instructorKeyInput = document.getElementById("instructor-key-input");
  const verifyKeyButton = document.getElementById("btn-verify-key");
  const cancelKeyButton = document.getElementById("btn-cancel-key");
  const keyErrorMessage = document.getElementById("key-error-msg");
  const editorPanel = document.getElementById("live-code-editor-panel");
  const editorProjectBoard = document.getElementById("editor-project-board");
  const editWiringInput = document.getElementById("edit-wiring-input");
  const editCodeTextarea = document.getElementById("edit-code-textarea");
  const saveNewCodeButton = document.getElementById("btn-save-new-code");
  const resetDefaultCodeButton = document.getElementById("btn-reset-default-code");
  const closeEditorButton = document.getElementById("btn-close-editor");
  const replaceCodeStatus = document.getElementById("replace-code-status");
  const masterDocInfo = document.getElementById("master-doc-info");
  const downloadMasterDocButton = document.getElementById("btn-download-master-doc");
  const masterDocDownloadText = document.getElementById("master-doc-download-text");
  const adminDocUploadPanel = document.getElementById("admin-doc-upload-panel");
  const replaceMasterDocButton = document.getElementById("btn-replace-master-doc");
  const masterDocFileInput = document.getElementById("input-master-doc-file");
  const masterDocUploadStatus = document.getElementById("master-doc-upload-status");
  const replayTourButton = document.getElementById("btn-replay-tour");
  const studentGreetingBadge = document.getElementById("student-greeting-badge");
  const tourWelcomeOverlay = document.getElementById("tour-welcome-overlay");
  const tourStudentNameInput = document.getElementById("tour-student-name-input");
  const tourNameError = document.getElementById("tour-name-error");
  const beginTourButton = document.getElementById("btn-begin-guided-tour");
  const skipWelcomeButton = document.getElementById("btn-skip-welcome-tour");
  const tourStepCard = document.getElementById("tour-step-card");
  const tourStepCounter = document.getElementById("tour-step-counter");
  const tourStepTitle = document.getElementById("tour-step-title");
  const tourStepBody = document.getElementById("tour-step-body");
  const exitTourButton = document.getElementById("btn-exit-tour");
  const previousTourButton = document.getElementById("btn-tour-prev");
  const nextTourButton = document.getElementById("btn-tour-next");
  const boardCards = {
    arduino: document.getElementById("card-arduino"),
    esp32: document.getElementById("card-esp32")
  };
  const boardImages = {
    arduino: document.getElementById("img-arduino"),
    esp32: document.getElementById("img-esp32")
  };
  const wiringBoxes = {
    arduino: document.getElementById("wiring-arduino"),
    esp32: document.getElementById("wiring-esp32")
  };

  if (
    !modal || !modalTitle || !closeButton || !codeDisplay || !filenameDisplay ||
    !activeBoardBadge || !copyButton || !copyButtonText ||
    !replaceButton || !keyGatePanel || !instructorKeyInput ||
    !verifyKeyButton || !cancelKeyButton || !keyErrorMessage ||
    !editorPanel || !editorProjectBoard || !editWiringInput ||
    !editCodeTextarea || !saveNewCodeButton || !resetDefaultCodeButton ||
    !closeEditorButton || !replaceCodeStatus || !masterDocInfo ||
    !downloadMasterDocButton || !masterDocDownloadText || !adminDocUploadPanel ||
    !replaceMasterDocButton || !masterDocFileInput || !masterDocUploadStatus ||
    !replayTourButton ||
    !studentGreetingBadge || !tourWelcomeOverlay || !tourStudentNameInput ||
    !tourNameError || !beginTourButton || !skipWelcomeButton ||
    !tourStepCard || !tourStepCounter || !tourStepTitle || !tourStepBody ||
    !exitTourButton || !previousTourButton || !nextTourButton ||
    !boardCards.arduino || !boardCards.esp32 ||
    !boardImages.arduino || !boardImages.esp32 ||
    !wiringBoxes.arduino || !wiringBoxes.esp32
  ) {
    console.error("Get Robotics: required project modal elements are missing.");
    return;
  }

  let activeProject = null;
  let activeProjectId = null;
  let activeBoard = "arduino";
  let previousFocus = null;
  let copyConfirmationTimer = 0;
  let customCodes = {};
  let studentName = "";
  let tourStepIndex = 0;
  let spotlightedElement = null;
  let adminModeUnlocked = false;
  let masterDocMetadata = null;

  function loadCustomCodes() {
    try {
      const saved = localStorage.getItem("getrobotics_custom_codes");
      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new TypeError("Saved project overrides must be an object.");
      }

      Object.values(parsed).forEach((override) => {
        if (!override || typeof override !== "object") {
          return;
        }
        const project = projects[override.projectId];
        const board = override.board;
        if (
          !project || (board !== "arduino" && board !== "esp32") ||
          typeof override.code !== "string"
        ) {
          return;
        }
        project.code[board] = override.code;
        if (typeof override.wiring === "string") {
          project.wiring[board] = override.wiring;
        }
        customCodes[`${override.projectId}_${board}`] = {
          projectId: override.projectId,
          board,
          code: override.code,
          wiring: project.wiring[board]
        };
      });
    } catch (error) {
      console.error("Get Robotics: unable to load locally saved project code.", error);
    }
  }

  loadCustomCodes();

  function applyCloudData(snapshot) {
    snapshot.forEach((docSnap) => {
      const projectId = aliases[docSnap.id] || docSnap.id;
      const project = projects[projectId];
      if (!project) {
        return;
      }

      const cloudData = docSnap.data();
      ["arduino", "esp32"].forEach((board) => {
        const code = cloudData[board] ?? cloudData[`${board}Code`];
        const wiring = cloudData[`${board}Wiring`];
        if (typeof code === "string") {
          project.code[board] = code;
          customCodes[`${projectId}_${board}`] = {
            projectId,
            board,
            code,
            wiring: typeof wiring === "string" ? wiring : project.wiring[board]
          };
        }
        if (typeof wiring === "string") {
          project.wiring[board] = wiring;
        }
      });
    });

    try {
      localStorage.setItem("getrobotics_custom_codes", JSON.stringify(customCodes));
    } catch (error) {
      console.error("Get Robotics: unable to cache cloud-synced project code.", error);
    }

    if (activeProject && activeProjectId) {
      wiringBoxes.arduino.textContent = activeProject.wiring.arduino;
      wiringBoxes.esp32.textContent = activeProject.wiring.esp32;
      codeDisplay.textContent = activeProject.code[activeBoard];
      if (editorPanel.style.display !== "none") {
        editCodeTextarea.value = activeProject.code[activeBoard];
        editWiringInput.value = activeProject.wiring[activeBoard];
      }
    }
  }

  onSnapshot(collection(db, 'robotics_codes'), applyCloudData, (error) => {
    console.error("Get Robotics: Firestore code sync failed.", error);
  });

  function formatMasterDocSize(fileSize) {
    return fileSize >= 1024 * 1024
      ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
      : `${(fileSize / 1024).toFixed(1)} KB`;
  }

  function formatMasterDocDate(updatedAt) {
    const updatedDate = new Date(updatedAt);
    return Number.isNaN(updatedDate.getTime())
      ? "Unknown date"
      : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(updatedDate);
  }

  function setMasterDocUploadStatus(message, isError = false) {
    masterDocUploadStatus.textContent = message;
    masterDocUploadStatus.classList.toggle("master-doc-upload-status-error", isError);
  }

  function applyMasterDocMetadata(metaSnap) {
    if (!metaSnap.exists()) {
      masterDocMetadata = null;
      masterDocInfo.textContent = "No document uploaded yet";
      downloadMasterDocButton.disabled = true;
      return;
    }

    const metadata = metaSnap.data();
    if (
      typeof metadata.fileName !== "string" ||
      typeof metadata.fileSize !== "number" ||
      !Number.isFinite(metadata.fileSize) ||
      !Number.isInteger(metadata.totalChunks) ||
      metadata.totalChunks < 1
    ) {
      masterDocMetadata = null;
      masterDocInfo.textContent = "Document metadata is invalid.";
      downloadMasterDocButton.disabled = true;
      console.error("Get Robotics: the Master Docs metadata is invalid.");
      return;
    }

    masterDocMetadata = metadata;
    masterDocInfo.textContent =
      `${metadata.fileName} · ${formatMasterDocSize(metadata.fileSize)} · Updated ${formatMasterDocDate(metadata.updatedAt)}`;
    downloadMasterDocButton.disabled = false;
  }

  onSnapshot(
    doc(db, "robotics_master_doc", "metadata"),
    applyMasterDocMetadata,
    (error) => {
      masterDocMetadata = null;
      masterDocInfo.textContent = "Unable to load document status.";
      downloadMasterDocButton.disabled = true;
      console.error("Get Robotics: Master Docs metadata sync failed.", error);
    }
  );

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new TypeError("The selected file could not be read as a data URL."));
          return;
        }
        resolve(reader.result);
      };
      reader.onerror = () => reject(reader.error || new Error("The selected file could not be read."));
      reader.onabort = () => reject(new Error("Reading the selected file was cancelled."));
      reader.readAsDataURL(file);
    });
  }

  async function uploadMasterDoc(file) {
    if (!adminModeUnlocked || !file) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert("Please upload a file smaller than 5 MB.");
      return;
    }

    replaceMasterDocButton.disabled = true;
    setMasterDocUploadStatus("Reading file...");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const CHUNK_SIZE = 600000;
      const chunks = [];
      for (let offset = 0; offset < dataUrl.length; offset += CHUNK_SIZE) {
        chunks.push(dataUrl.slice(offset, offset + CHUNK_SIZE));
      }

      setMasterDocUploadStatus("Uploading to cloud...");
      const metadataRef = doc(db, "robotics_master_doc", "metadata");
      const previousMetadataSnap = await getDoc(metadataRef);
      const previousTotalChunks = previousMetadataSnap.exists()
        ? previousMetadataSnap.data().totalChunks
        : 0;

      for (let index = 0; index < chunks.length; index += 1) {
        await setDoc(doc(db, "robotics_master_doc_chunks", `chunk_${index}`), {
          index,
          data: chunks[index]
        });
      }

      await setDoc(metadataRef, {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        totalChunks: chunks.length,
        updatedAt: new Date().toISOString()
      });

      let cleanupFailed = false;
      if (
        Number.isInteger(previousTotalChunks) &&
        previousTotalChunks > chunks.length &&
        previousTotalChunks <= 1000
      ) {
        try {
          for (let index = chunks.length; index < previousTotalChunks; index += 1) {
            await deleteDoc(doc(db, "robotics_master_doc_chunks", `chunk_${index}`));
          }
        } catch (error) {
          cleanupFailed = true;
          console.error("Get Robotics: unable to remove superseded Master Docs chunks.", error);
        }
      }

      setMasterDocUploadStatus(
        cleanupFailed
          ? "Master Docs file replaced live for all students! Old unused chunks could not be removed."
          : "Master Docs file replaced live for all students!",
        cleanupFailed
      );
    } catch (error) {
      console.error("Get Robotics: unable to upload the Master Docs file.", error);
      setMasterDocUploadStatus("Upload failed. Check the connection and Firestore rules.", true);
    } finally {
      replaceMasterDocButton.disabled = false;
      masterDocFileInput.value = "";
    }
  }

  async function downloadMasterDoc() {
    if (!masterDocMetadata || downloadMasterDocButton.disabled) {
      return;
    }

    const metadata = masterDocMetadata;
    downloadMasterDocButton.disabled = true;
    masterDocDownloadText.textContent = "Preparing download...";
    try {
      const chunkSnapshot = await getDocs(collection(db, "robotics_master_doc_chunks"));
      const chunks = chunkSnapshot.docs
        .map((chunkDoc) => chunkDoc.data())
        .filter((chunk) => Number.isInteger(chunk.index) && chunk.index >= 0 && chunk.index < metadata.totalChunks)
        .sort((left, right) => left.index - right.index);

      if (
        chunks.length !== metadata.totalChunks ||
        chunks.some((chunk, index) => chunk.index !== index || typeof chunk.data !== "string")
      ) {
        throw new Error("The uploaded document is incomplete in cloud storage.");
      }

      const dataUrl = chunks.map((chunk) => chunk.data).join("");
      const dataUrlMatch = /^data:([^;,]+)?;base64,([\s\S]*)$/.exec(dataUrl);
      if (!dataUrlMatch) {
        throw new Error("The uploaded document data is invalid.");
      }

      const binaryData = atob(dataUrlMatch[2]);
      const bytes = new Uint8Array(binaryData.length);
      for (let index = 0; index < binaryData.length; index += 1) {
        bytes[index] = binaryData.charCodeAt(index);
      }
      const blob = new Blob([bytes], { type: dataUrlMatch[1] || metadata.mimeType });
      if (blob.size !== metadata.fileSize) {
        throw new Error("The downloaded document size does not match its metadata.");
      }

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = metadata.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (error) {
      console.error("Get Robotics: unable to download the Master Docs file.", error);
      window.alert("Unable to download the Master Docs file. Please check your connection and try again.");
    } finally {
      masterDocDownloadText.textContent = "Download Master Docs File";
      downloadMasterDocButton.disabled = !masterDocMetadata;
    }
  }

  function makeBoardGuide(board) {
    const isEsp32 = board === "esp32";
    const title = isEsp32 ? "ESP32" : "ARDUINO UNO";
    const boardColor = isEsp32 ? "#24305A" : "#126E55";
    const pinLabels = isEsp32
      ? ["3V3", "GND", "23", "22", "1", "3", "21", "19"]
      : ["5V", "GND", "13", "12", "11", "10", "9", "8"];
    const pinMarkup = pinLabels.map((label, index) => {
      const y = 55 + index * 21;
      return `<rect x="26" y="${y}" width="15" height="8" rx="2" fill="#CBD5E1"/><text x="49" y="${y + 7}" fill="#E2E8F0" font-family="Arial,sans-serif" font-size="9">${label}</text>`;
    }).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="260" viewBox="0 0 640 260"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#111827"/><stop offset="1" stop-color="#050811"/></linearGradient></defs><rect width="640" height="260" fill="url(#g)"/><path d="M0 220h640M0 40h640" stroke="#00F0FF" stroke-opacity=".12"/><rect x="175" y="34" width="290" height="192" rx="18" fill="${boardColor}" stroke="#00F0FF" stroke-width="2"/><rect x="245" y="81" width="144" height="96" rx="9" fill="#101827" stroke="#94A3B8" stroke-opacity=".6"/><path d="M260 96h114v66H260z" fill="#172033"/><text x="317" y="125" fill="#F8FAFC" font-family="Arial,sans-serif" font-size="17" font-weight="700" text-anchor="middle">${title}</text><text x="317" y="148" fill="#00F0FF" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">PROJECT BOARD GUIDE</text>${pinMarkup}<circle cx="430" cy="72" r="13" fill="#00F0FF" fill-opacity=".85"/><circle cx="430" cy="188" r="8" fill="#A855F7"/><text x="320" y="247" fill="#94A3B8" font-family="Arial,sans-serif" font-size="11" text-anchor="middle">Check board labels before connecting power</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function getSavedStudentName() {
    try {
      return localStorage.getItem("getrobotics_student_name") || "";
    } catch (error) {
      console.error("Get Robotics: unable to read the saved student name.", error);
      return "";
    }
  }

  function setGreetingBadge(name) {
    if (!name) {
      studentGreetingBadge.textContent = "";
      studentGreetingBadge.style.display = "none";
      return;
    }
    studentGreetingBadge.textContent = `Builder: ${name}`;
    studentGreetingBadge.style.display = "inline-flex";
  }

  function clearTourSpotlight() {
    if (spotlightedElement) {
      spotlightedElement.classList.remove("tour-spotlight");
    }
    document.querySelectorAll(".tour-spotlight").forEach((element) => {
      element.classList.remove("tour-spotlight");
    });
    spotlightedElement = null;
  }

  function highlightElement(selector) {
    clearTourSpotlight();
    const target = document.querySelector(selector);
    if (!target) {
      console.error(`Get Robotics: tour target "${selector}" was not found.`);
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("tour-spotlight");
    spotlightedElement = target;
  }

  function ensureTourProjectOpen() {
    if (modal.style.display === "none" || activeProjectId !== "stick") {
      const firstCard = document.querySelector('.project-card[data-project-id="stick"]');
      openProject("stick", firstCard);
    }
  }

  function renderTourStep() {
    const name = studentName;
    const steps = [
      {
        title: `1. Your 6 Robotics Lab Projects, ${name}`,
        body: `Welcome to Get Robotics, ${name}! On this page are the 6 hardware projects you are going to build: Smart Blind Walking Stick, Autonomous Motor Car, Wi-Fi Controlled Car, Laser Obstacle Detector, Breadboard Multi-LED Array, and Smart Waste Bin.`,
        action: () => {
          if (modal.style.display !== "none") {
            closeProject();
          }
          highlightElement("#projects-grid");
        }
      },
      {
        title: `2. Tap Your Project Card, ${name}`,
        body: `${name}, each project box shows the reference image and hardware components you need. Once you finish wiring your circuit, tap 'Select Board & Get Code' on that project. Let's open Project 01 together on the next step!`,
        action: () => {
          if (modal.style.display !== "none") {
            closeProject();
          }
          highlightElement('.project-card[data-project-id="stick"]');
        }
      },
      {
        title: `3. Choose Your Robot Brain, ${name}`,
        body: `Look at these two columns, ${name}. Column 1 is for Arduino Uno and Column 2 is for ESP32. Each column shows its exact pin wiring guide. Tap Arduino Uno if you built your project with an Arduino Uno, or tap ESP32 if you used an ESP32 board.`,
        action: () => {
          ensureTourProjectOpen();
          highlightElement(".board-columns");
        }
      },
      {
        title: `4. Full Ready-to-Run Code, ${name}`,
        body: `As soon as you tap your board, ${name}, the complete verified C++ code loads inside this terminal. Switching between Arduino Uno and ESP32 automatically updates the code to match that board's pins.`,
        action: () => {
          ensureTourProjectOpen();
          selectBoard("arduino");
          highlightElement("#code-section");
        }
      },
      {
        title: `5. Copy & Upload to Arduino IDE, ${name}`,
        body: `Finally, ${name}, tap this 'Copy Code' button. It copies the entire code straight to your laptop or phone clipboard. Then open your Arduino IDE, paste the code, and upload it to your robot. You are ready to build, ${name}!`,
        action: () => {
          ensureTourProjectOpen();
          selectBoard("arduino");
          highlightElement("#btn-copy-code");
        }
      }
    ];

    const step = steps[tourStepIndex];
    if (!step) {
      finishTour();
      return;
    }
    step.action();
    tourStepCounter.textContent = `STEP ${tourStepIndex + 1} OF ${steps.length}`;
    tourStepTitle.textContent = step.title;
    tourStepBody.textContent = step.body;
    previousTourButton.disabled = tourStepIndex === 0;
    nextTourButton.textContent = tourStepIndex === steps.length - 1 ? "Finish Tour" : "Next Step";
    tourStepCard.style.display = "block";
  }

  function openTourWelcome() {
    clearTourSpotlight();
    tourStepCard.style.display = "none";
    if (modal.style.display !== "none") {
      closeProject();
    }
    studentName = getSavedStudentName();
    tourStudentNameInput.value = studentName;
    tourNameError.style.display = "none";
    tourWelcomeOverlay.style.display = "flex";
    tourStudentNameInput.focus();
  }

  function beginGuidedTour() {
    const enteredName = tourStudentNameInput.value.trim();
    if (!enteredName) {
      tourNameError.style.display = "block";
      tourStudentNameInput.focus();
      return;
    }

    studentName = enteredName.slice(0, 30);
    try {
      localStorage.setItem("getrobotics_student_name", studentName);
    } catch (error) {
      console.error("Get Robotics: unable to save the student name.", error);
    }
    setGreetingBadge(studentName);
    tourWelcomeOverlay.style.display = "none";
    tourNameError.style.display = "none";
    tourStepIndex = 0;
    renderTourStep();
  }

  function finishTour() {
    clearTourSpotlight();
    tourStepCard.style.display = "none";
    if (modal.style.display !== "none") {
      closeProject();
    }
    try {
      localStorage.setItem("getrobotics_tour_completed", "true");
    } catch (error) {
      console.error("Get Robotics: unable to save tour completion.", error);
    }
  }

  async function isKeyValid(input) {
    const cleanedInput = input.trim().toLowerCase();
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(cleanedInput)
    );
    const hashHex = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return hashHex === "03fbc9106caf1f5ab73da7c421bcb828cee173a898de4cada142db185a89fd6c";
  }

  function setReplaceCodeStatus(message, isError = false) {
    replaceCodeStatus.textContent = message;
    replaceCodeStatus.classList.toggle("replace-code-status-error", isError);
  }

  function hideReplaceCodePanels() {
    keyGatePanel.style.display = "none";
    editorPanel.style.display = "none";
    keyErrorMessage.style.display = "none";
  }

  function lockAdminMode() {
    adminModeUnlocked = false;
    adminDocUploadPanel.style.display = "none";
    masterDocFileInput.value = "";
  }

  function openKeyGate() {
    if (!activeProject) {
      return;
    }
    setReplaceCodeStatus("");
    editorPanel.style.display = "none";
    keyGatePanel.style.display = "block";
    instructorKeyInput.value = "";
    keyErrorMessage.textContent = "Invalid key! Only the setting key can unlock code editing.";
    keyErrorMessage.style.display = "none";
    instructorKeyInput.focus();
  }

  async function verifyInstructorKey() {
    try {
      if (!(await isKeyValid(instructorKeyInput.value))) {
        keyErrorMessage.textContent = "Invalid key! Only the setting key can unlock code editing.";
        keyErrorMessage.style.display = "inline";
        instructorKeyInput.focus();
        return;
      }

      keyGatePanel.style.display = "none";
      keyErrorMessage.style.display = "none";
      adminModeUnlocked = true;
      adminDocUploadPanel.style.display = "flex";
      editorPanel.style.display = "block";
      editorProjectBoard.textContent = `Editing: ${activeProject.title} — ${activeBoard === "arduino" ? "Arduino Uno Code" : "ESP32 Code"}`;
      editCodeTextarea.value = activeProject.code[activeBoard];
      editWiringInput.value = activeProject.wiring[activeBoard];
      editCodeTextarea.focus();
    } catch (error) {
      console.error("Get Robotics: setting key verification failed.", error);
      keyErrorMessage.textContent = "Key verification is unavailable in this browser context.";
      keyErrorMessage.style.display = "inline";
    }
  }

  async function saveCodeOverride() {
    if (!activeProject || !activeProjectId) {
      return;
    }

    const newCodeString = editCodeTextarea.value;
    if (!newCodeString.trim()) {
      setReplaceCodeStatus("Code cannot be empty.", true);
      editCodeTextarea.focus();
      return;
    }

    const boardType = activeBoard;
    const newWiring = editWiringInput.value.trim() || activeProject.wiring[activeBoard];
    const key = `${activeProjectId}_${activeBoard}`;
    const override = {
      projectId: activeProjectId,
      board: activeBoard,
      code: newCodeString,
      wiring: newWiring
    };
    const updatedOverrides = { ...customCodes, [key]: override };

    try {
      localStorage.setItem("getrobotics_custom_codes", JSON.stringify(updatedOverrides));
    } catch (error) {
      console.error("Get Robotics: unable to cache project code in this browser.", error);
    }

    customCodes = updatedOverrides;
    activeProject.code[boardType] = newCodeString;
    activeProject.wiring[activeBoard] = newWiring;
    wiringBoxes[activeBoard].textContent = newWiring;
    codeDisplay.textContent = newCodeString;
    editorPanel.style.display = "none";
    setReplaceCodeStatus("Saving to cloud...");
    try {
      await setDoc(doc(db, 'robotics_codes', String(activeProjectId)), {
        [boardType]: newCodeString,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setReplaceCodeStatus("Saved live for all students!");
    } catch (error) {
      console.error("Get Robotics: unable to sync project code to Firestore.", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setReplaceCodeStatus("Cloud save failed. Check the connection and Firestore rules.", true);
      window.alert(`Cloud save failed: ${errorMessage}`);
    }
  }

  async function resetCodeOverride() {
    if (!activeProject || !activeProjectId) {
      return;
    }

    const key = `${activeProjectId}_${activeBoard}`;
    const updatedOverrides = { ...customCodes };
    delete updatedOverrides[key];
    try {
      if (Object.keys(updatedOverrides).length) {
        localStorage.setItem("getrobotics_custom_codes", JSON.stringify(updatedOverrides));
      } else {
        localStorage.removeItem("getrobotics_custom_codes");
      }
    } catch (error) {
      console.error("Get Robotics: unable to reset locally saved project code.", error);
      setReplaceCodeStatus("Could not reset this code in browser storage. Try again.", true);
      return;
    }

    customCodes = updatedOverrides;
    activeProject.code[activeBoard] = factoryProjects[activeProjectId].code[activeBoard];
    activeProject.wiring[activeBoard] = factoryProjects[activeProjectId].wiring[activeBoard];
    editCodeTextarea.value = activeProject.code[activeBoard];
    editWiringInput.value = activeProject.wiring[activeBoard];
    wiringBoxes[activeBoard].textContent = activeProject.wiring[activeBoard];
    codeDisplay.textContent = activeProject.code[activeBoard];
    editorPanel.style.display = "none";
    try {
      await setDoc(doc(db, 'robotics_codes', String(activeProjectId)), {
        [activeBoard]: activeProject.code[activeBoard],
        [`${activeBoard}Wiring`]: activeProject.wiring[activeBoard],
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setReplaceCodeStatus("Factory default code and wiring restored across devices.");
    } catch (error) {
      console.error("Get Robotics: unable to sync the project reset to Firestore.", error);
      setReplaceCodeStatus("Code was reset in this browser, but cloud sync failed. Check the connection and Firestore rules.", true);
    }
  }

  function selectBoard(board) {
    if (!activeProject || (board !== "arduino" && board !== "esp32")) {
      return;
    }
    hideReplaceCodePanels();
    activeBoard = board;
    boardCards.arduino.classList.toggle("active", board === "arduino");
    boardCards.esp32.classList.toggle("active", board === "esp32");
    codeDisplay.textContent = activeProject.code[board];
    filenameDisplay.textContent = `${activeProject.filename}_${board === "arduino" ? "uno" : "esp32"}.ino`;
    activeBoardBadge.textContent = board === "arduino" ? "Arduino Uno Selected" : "ESP32 Selected";
    copyButtonText.textContent = `Copy Code for ${board === "arduino" ? "Arduino IDE" : "ESP32"}`;
    resetCopyButton();
  }

  function openProject(projectId, trigger) {
    const canonicalId = aliases[projectId] || projectId;
    const project = projects[canonicalId];
    if (!project) {
      console.error(`Get Robotics: no project data found for "${projectId}".`);
      return;
    }

    activeProject = project;
    activeProjectId = canonicalId;
    previousFocus = trigger instanceof HTMLElement ? trigger : null;
    hideReplaceCodePanels();
    setReplaceCodeStatus("");
    modalTitle.textContent = project.title;
    boardImages.arduino.src = makeBoardGuide("arduino");
    boardImages.esp32.src = makeBoardGuide("esp32");
    boardImages.arduino.alt = `${project.title} Arduino Uno board guide`;
    boardImages.esp32.alt = `${project.title} ESP32 board guide`;
    wiringBoxes.arduino.textContent = project.wiring.arduino;
    wiringBoxes.esp32.textContent = project.wiring.esp32;
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    selectBoard("arduino");
    closeButton.focus();
  }

  function closeProject() {
    lockAdminMode();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    activeProject = null;
    activeProjectId = null;
    if (previousFocus && previousFocus.isConnected) {
      previousFocus.focus();
    }
  }

  function resetCopyButton() {
    window.clearTimeout(copyConfirmationTimer);
    copyButton.classList.remove("copied");
    copyButtonText.textContent = `Copy Code for ${activeBoard === "arduino" ? "Arduino IDE" : "ESP32"}`;
  }

  function copyUsingTextarea(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("aria-hidden", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } finally {
      textarea.remove();
    }
    if (!copied) {
      throw new Error("The browser could not copy the code to the clipboard.");
    }
  }

  async function copyCurrentCode() {
    const code = codeDisplay.textContent;
    if (!code) {
      console.error("Get Robotics: there is no code to copy.");
      return;
    }

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        try {
          await navigator.clipboard.writeText(code);
        } catch (_clipboardError) {
          copyUsingTextarea(code);
        }
      } else {
        copyUsingTextarea(code);
      }
      window.clearTimeout(copyConfirmationTimer);
      copyButton.classList.add("copied");
      copyButtonText.textContent = "Copied! Paste in Arduino IDE";
      copyConfirmationTimer = window.setTimeout(resetCopyButton, 2500);
    } catch (error) {
      console.error("Get Robotics: unable to copy project code.", error);
      copyButton.classList.remove("copied");
      copyButtonText.textContent = "Copy failed — select code manually";
      window.clearTimeout(copyConfirmationTimer);
      copyConfirmationTimer = window.setTimeout(resetCopyButton, 2500);
    }
  }

  document.querySelectorAll(".project-card[data-project-id]").forEach((card) => {
    card.addEventListener("click", (event) => {
      const projectId = card.dataset.projectId;
      openProject(projectId, event.target instanceof HTMLElement ? event.target : card);
    });
    card.addEventListener("keydown", (event) => {
      if (event.target !== card || (event.key !== "Enter" && event.key !== " ")) {
        return;
      }
      event.preventDefault();
      openProject(card.dataset.projectId, card);
    });
    card.tabIndex = 0;
  });

  Object.entries(boardCards).forEach(([board, card]) => {
    card.addEventListener("click", () => selectBoard(board));
  });

  document.getElementById("btn-show-arduino").addEventListener("click", (event) => {
    event.stopPropagation();
    selectBoard("arduino");
  });
  document.getElementById("btn-show-esp32").addEventListener("click", (event) => {
    event.stopPropagation();
    selectBoard("esp32");
  });
  replaceButton.addEventListener("click", openKeyGate);
  verifyKeyButton.addEventListener("click", verifyInstructorKey);
  instructorKeyInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      verifyInstructorKey();
    }
  });
  cancelKeyButton.addEventListener("click", () => {
    keyGatePanel.style.display = "none";
    keyErrorMessage.style.display = "none";
    lockAdminMode();
    replaceButton.focus();
  });
  saveNewCodeButton.addEventListener("click", saveCodeOverride);
  resetDefaultCodeButton.addEventListener("click", resetCodeOverride);
  closeEditorButton.addEventListener("click", () => {
    editorPanel.style.display = "none";
    lockAdminMode();
    replaceButton.focus();
  });
  replaceMasterDocButton.addEventListener("click", () => {
    if (adminModeUnlocked) {
      masterDocFileInput.click();
    }
  });
  masterDocFileInput.addEventListener("change", () => {
    const [file] = masterDocFileInput.files || [];
    if (file) {
      uploadMasterDoc(file);
    }
  });
  downloadMasterDocButton.addEventListener("click", downloadMasterDoc);
  replayTourButton.addEventListener("click", openTourWelcome);
  beginTourButton.addEventListener("click", beginGuidedTour);
  tourStudentNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      beginGuidedTour();
    }
  });
  skipWelcomeButton.addEventListener("click", () => {
    tourWelcomeOverlay.style.display = "none";
  });
  previousTourButton.addEventListener("click", () => {
    if (tourStepIndex > 0) {
      tourStepIndex -= 1;
      renderTourStep();
    }
  });
  nextTourButton.addEventListener("click", () => {
    if (tourStepIndex >= 4) {
      finishTour();
      return;
    }
    tourStepIndex += 1;
    renderTourStep();
  });
  exitTourButton.addEventListener("click", finishTour);
  closeButton.addEventListener("click", closeProject);
  copyButton.addEventListener("click", copyCurrentCode);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeProject();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.style.display !== "none") {
      closeProject();
    }
  });

  studentName = getSavedStudentName();
  setGreetingBadge(studentName);
  try {
    if (localStorage.getItem("getrobotics_tour_completed") !== "true") {
      window.setTimeout(openTourWelcome, 400);
    }
  } catch (error) {
    console.error("Get Robotics: unable to read tour completion status.", error);
    window.setTimeout(openTourWelcome, 400);
  }
})();