# Receiptly

A React Native + Expo app for scanning receipts, extracting line items via OCR, and splitting bills with friends.

## Features

- 📸 Scan receipts using device camera or import from gallery
- 🔍 On-device OCR using Google ML Kit Text Recognition
- ☁️ AWS Textract fallback for low-confidence scans
- 👥 Tag friends on items using device contacts
- 💰 Split items 50/50 with simple swipe gestures
- 💸 Send payments via Venmo or Cash App
- 📊 View receipt history (optional)

## Project Structure

This is a monorepo using npm workspaces:
```
receiptly/
├── apps/
│   └── receiptly/    # Main React Native app
└── packages/         # Shared packages (future use)
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/receiptly.git
cd receiptly
```

2. Install dependencies at the root level:
```bash
npm install
```

3. Create a `.env` file in `apps/receiptly/` directory with your API keys:
```bash
cd apps/receiptly
cp env.example .env
```

Then edit `.env` with your actual keys:
```
# Google Cloud Vision API (for OCR text recognition)
EXPO_PUBLIC_GOOGLE_VISION_API_KEY=your_google_cloud_vision_api_key_here

# AWS Credentials for Textract (fallback OCR)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Cash App Pay API (Optional)
CASH_APP_CLIENT_ID=your_client_id
CASH_APP_API_KEY=your_api_key
```

4. For iOS development (macOS only):
```bash
cd apps/receiptly/ios
pod install
cd ../../..
```

5. Start the development server:
```bash
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| EXPO_PUBLIC_GOOGLE_VISION_API_KEY | Google Cloud Vision API key for primary OCR | Yes |
| AWS_ACCESS_KEY_ID | AWS IAM user access key with Textract permissions | Yes |
| AWS_SECRET_ACCESS_KEY | AWS IAM user secret key | Yes |
| AWS_REGION | AWS region (default: us-east-1) | No |
| CASH_APP_CLIENT_ID | Cash App Pay API client ID | No |
| CASH_APP_API_KEY | Cash App Pay API key | No |

## Available Scripts

From the root directory:

```bash
# Start the Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run unit tests
npm test

# Run linter
npm run lint

# Run TypeScript type checking
npm run typecheck

# Format code
npm run format
```

Note: TypeScript checking is done automatically by the TypeScript compiler during development.

## TODO / Stretch Goals

- [ ] Export receipt data to CSV
- [ ] Support multiple receipts in a single session
- [ ] Add receipt categories and tags
- [ ] Implement receipt search and filtering
- [ ] Create Figma designs and apply AI-driven UI refinements
- [ ] Add receipt date picker and manual editing
- [ ] Support splitting by percentage or custom amounts
- [ ] Add offline support with local storage
- [ ] Implement user authentication
- [ ] Add receipt sharing via deep links

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 