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

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/receiptly.git
cd receiptly
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your API keys:
```
# AWS Credentials for Textract
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Cash App Pay API (Optional)
CASH_APP_CLIENT_ID=your_client_id
CASH_APP_API_KEY=your_api_key
```

4. Start the development server:
```bash
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| AWS_ACCESS_KEY_ID | AWS IAM user access key with Textract permissions | Yes |
| AWS_SECRET_ACCESS_KEY | AWS IAM user secret key | Yes |
| AWS_REGION | AWS region (default: us-east-1) | No |
| CASH_APP_CLIENT_ID | Cash App Pay API client ID | No |
| CASH_APP_API_KEY | Cash App Pay API key | No |

## Testing

```bash
# Run unit tests
npm test

# Run linter
npm run lint

# Run type checking
npm run typecheck
```

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