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
    !closeEditorButton || !replaceCodeStatus ||
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

  async function isKeyValid(input) {
    const cleanedInput = input.trim().toLowerCase();
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(cleanedInput)
    );
    const hashHex = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return hashHex === "a7c008c1eddcab3f52e29c6959857935c5bdf1dce34ab0196e22f6552e2620d0";
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

  function saveCodeOverride() {
    if (!activeProject || !activeProjectId) {
      return;
    }

    const newCode = editCodeTextarea.value;
    if (!newCode.trim()) {
      setReplaceCodeStatus("Code cannot be empty.", true);
      editCodeTextarea.focus();
      return;
    }

    const newWiring = editWiringInput.value.trim() || activeProject.wiring[activeBoard];
    const key = `${activeProjectId}_${activeBoard}`;
    const override = {
      projectId: activeProjectId,
      board: activeBoard,
      code: newCode,
      wiring: newWiring
    };
    const updatedOverrides = { ...customCodes, [key]: override };

    try {
      localStorage.setItem("getrobotics_custom_codes", JSON.stringify(updatedOverrides));
    } catch (error) {
      console.error("Get Robotics: unable to save project code in this browser.", error);
      setReplaceCodeStatus("Could not save this code in browser storage. Check available storage and try again.", true);
      return;
    }

    customCodes = updatedOverrides;
    activeProject.code[activeBoard] = newCode;
    activeProject.wiring[activeBoard] = newWiring;
    wiringBoxes[activeBoard].textContent = newWiring;
    codeDisplay.textContent = newCode;
    editorPanel.style.display = "none";
    setReplaceCodeStatus("Code replaced successfully! This browser will use the updated code.");
  }

  function resetCodeOverride() {
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
    setReplaceCodeStatus("Factory default code and wiring restored for this browser.");
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
      copyButtonText.textContent = "✓ Copied! Paste in Arduino IDE";
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
    replaceButton.focus();
  });
  saveNewCodeButton.addEventListener("click", saveCodeOverride);
  resetDefaultCodeButton.addEventListener("click", resetCodeOverride);
  closeEditorButton.addEventListener("click", () => {
    editorPanel.style.display = "none";
    replaceButton.focus();
  });
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
})();