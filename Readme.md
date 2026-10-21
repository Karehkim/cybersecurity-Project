# 🛡️ Password Strength Checker

A modern, privacy-focused password strength evaluator and security analyzer built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Capacitor**. 

Evaluations run **100% locally on your device** using pattern-matching heuristics and the industry-standard [`zxcvbn`](https://github.com/zxcvbn-ts/zxcvbn-ts) estimation engine. Passwords never touch a server or leave your browser.

---

## ✨ Features

- 🔒 **100% Client-Side & Private**  
  Zero telemetry, zero API requests, and zero remote logging. Every check runs locally in memory.

- 🧠 **Dual-Engine Evaluation**  
  - **`@zxcvbn-ts/core`**: Estimates real-world entropy, dictionary frequency, and brute-force cracking resistance.
  - **Custom Heuristics**: Detects predictable sequences (`1234`, `qwerty`), repeated characters (`aaa`), dictionary words, and common l33tspeak substitutions (`p@ssw0rd`).

- ⏱️ **Realistic Crack Time Estimates**  
  Displays estimated time to crack the password under slow offline hashing attack scenarios (e.g. bcrypt / Argon2).

- 💡 **Actionable Security Advice**  
  Provides tailored, contextual tips to turn weak credentials into resilient multi-word passphrases.

- 👁️ **Interactive & Accessible UI**  
  - Instant live feedback as you type (`aria-live="polite"`).
  - Mask/unmask password toggle.
  - Distinct color-coded strength ratings (*Weak*, *Fair*, *Strong*, *Very Strong*).
  - Responsive layout optimized for mobile screens, tablets, and desktop browsers.

- 📱 **Cross-Platform Native Support**  
  Configured with **Capacitor 8** to build and run as a standalone native Android application.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite` |
| **Entropy & Scoring Engine** | [@zxcvbn-ts/core](https://github.com/zxcvbn-ts/zxcvbn-ts) with English and Common language dictionaries |
| **Mobile Runtime** | [Capacitor 8](https://capacitorjs.com/) (Android) |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- *(Optional for Android builds)* [Android Studio](https://developer.android.com/studio) and JDK 17+

### 1. Clone the Repository

```bash
git clone https://github.com/Karehkim/cybersecurity-Project.git
cd "Password strength checker"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 🏗️ Production Build

To build the static web application for production:

```bash
npm run build
```

To preview the generated production build locally:

```bash
npm run preview
```

The optimized assets will be generated in the `dist/` directory.

---

## 📱 Mobile App (Android via Capacitor)

This project is configured with Capacitor to generate a native Android APK or run directly on an Android emulator or device.

### 1. Build and Sync Web Assets

```bash
npm run cap:build
```
*(This command runs `npm run build` followed by `npx cap sync`)*

### 2. Open in Android Studio

```bash
npm run cap:android
```

From Android Studio:
1. Wait for Gradle to finish indexing.
2. Select an emulator or connected physical Android device.
3. Click the **Run** (green triangle) button to launch the app.

---

## 📂 Project Structure

```text
├── android/               # Capacitor Android native project files
├── src/
│   ├── App.tsx            # Main application UI, zxcvbn integration & heuristic rules
│   ├── index.css          # Global styling & Tailwind CSS v4 configuration
│   ├── main.tsx           # React DOM root entrypoint
│   └── vite-env.d.ts      # Vite TypeScript type declarations
├── capacitor.config.ts    # Capacitor mobile app configuration
├── index.html             # Application HTML template & metadata
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript compiler configuration
└── vite.config.ts         # Vite bundler configuration & plugins
```

---

## 🔍 How the Strength Assessment Works

1. **Entropy & Dictionary Matching**  
   The password is first processed by `@zxcvbn-ts/core` against 30,000+ common passwords, surnames, popular English words, and spatial keyboard patterns.
2. **Heuristic Vulnerability Checks**  
   - **Length Check**: Passwords under 12 characters are flagged for vulnerability to brute-force attacks.
   - **Blacklisted Passwords**: Matches against high-frequency leaked lists (e.g. `password123`, `qwerty`, `admin`).
   - **Sequences**: Identifies alphabetical, numeric, or keyboard walks (`1234`, `asdf`, `zxcv`).
   - **Substitutions**: Catches basic leetspeak attempts (e.g. `@` for `a`, `0` for `o`).
   - **Repetition**: Catches consecutive repeated character runs (`aaa`, `111`).
3. **Crack Time Estimation**  
   Calculates the estimated duration required to crack the password under an offline attack against slow, modern cryptographic hashing algorithms.
4. **Scoring Breakdown**:
   - **0 - 1**: Weak (Immediate risk of compromise)
   - **2**: Fair (Needs improvement; vulnerable to targeted dictionary attacks)
   - **3**: Strong (Resilient against ordinary brute-force attempts)
   - **4**: Very Strong (Extremely difficult to crack; high entropy passphrase)

---

## 🛡️ Privacy & Security Notice

- **No Remote Transmission**: No password entered into this tool is ever transmitted over the network or saved to persistent storage.
- **Auto-Complete Disallowed**: Input fields specify `autocomplete="new-password"` and `spellcheck="false"` to prevent browser or keyboard caching.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add some amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - feel free to use and adapt it for educational or production purposes.
