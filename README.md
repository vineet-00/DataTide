# DataTide

DataTide is a highly customizable web scraper built with modern web technologies. It enables users to create, manage, and execute complex web scraping workflows through a visual, no-code/low-code interface powered by React Flow. With advanced features like AI-based data extraction via Together AI and secure billing integration with Stripe, DataTide is designed for developers, businesses, and data enthusiasts seeking efficient and scalable web scraping solutions.

## Screenshots
![Screenshot of homepage](public\assets\homepage.png)
![Screenshot of workflow](public\assets\workflows.png)
![Screenshot of workflow-editor](public\assets\workflow-editor.png)
![Screenshot of workflow-runs](public\assets\workflow-runs.png)
![Screenshot of credentials](public\assets\credentials.png)
![Screenshot of billing](public\assets\billing.png)
![Screenshot of transaction-history](public\assets\transaction-history.png)

## Features

- **Launch Browser:** Initiates a browser instance to begin the web scraping process, enabling interaction with web pages.
- **Page to HTML:** Extracts the complete HTML content of the current page for detailed analysis and processing.
- **Extract Text from Element:** Retrieves text content from a specified HTML element using a CSS selector.
- **Fill Input:** Automatically fills a specified input field with a desired value, emulating user input.
- **Click Element:** Simulates a click action on a specified HTML element, triggering events or navigation.
- **Scroll to Element:** Scrolls to a specified element, emulating user behavior for dynamic content loading.
- **Wait for Element:** Pauses the workflow until a specified element becomes visible or hidden.
- **Extract Data via AI:** Leverages Together AI to parse HTML content and extract structured data based on custom prompts, returning JSON output.
- **Read JSON:** Retrieves a specific key or property from a JSON object for use in workflows.
- **Build JSON:** Adds or updates data within an existing JSON object or creates a new one with specified properties.
- **Deliver via Webhook:** Sends scraped data to an external API endpoint through a POST request for further processing or storage.
- **Navigate to URL:** Navigates to a specified URL, loading the desired web page for scraping or interaction.
- **Billing Integration:** Securely manage subscriptions and payments through a Stripe-powered billing page.

## Technologies Used

-  **Next.js:** Framework for server-side rendering, server actions, and building the frontend and backend.
- **React:** JavaScript library for building the user interface.
- **React Flow:** Visual workflow builder for creating and managing scraping workflows.
- **PostgreSQL with Neon DB:** Scalable database for storing scraping configurations and data.
- **Prisma:** ORM for seamless database interactions.
- **Puppeteer:** Headless browser automation for web scraping tasks.
- **Together AI:** AI-powered data extraction for intelligent parsing of web content.
- **Stripe:** Secure payment processing for subscription-based billing.
- **Lucide React:** Icon library for a modern, aesthetic UI (e.g., Globe2 in the logo).
- **Tailwind CSS:** Utility-first CSS framework for a sleek, customizable design with a teal and blue-gray theme.
- **TypeScript:** Static typing for type-safe code.
- **Node.js:** JavaScript runtime for server-side logic (v18+).
- **ESLint:** Code linting for maintaining code quality.
- **Axios:** HTTP client for API requests to Together AI and webhooks.

## Getting Started
### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (via Neon DB or local instance)
- Stripe account and API keys

## Installation

1. **Clone the Repository:**
```
git clone https://github.com/vineet-00/DataTide.git
cd dataTide
```

2. **Install Dependencies:**
```
npm install
# or
yarn install

# or
pnpm install

# or
bun install
```


3. **Set Up Environment Variables:** Create a `.env.local` file in the root directory and add the following:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/setup

NEXT_PUBLIC_DEV_MODE=false

NEXT_PUBLIC_APP_URL=http://localhost:3000

API_SECRET=cookies_secret

STRIPE_SECRET_KEY=

STRIPE_PUBLIC_STRIPE_PUBLISHABLE_KEY=

ENCRYPTION_KEY=
```


4. **Set Up Prisma:Initialize the database schema:**
```
npx prisma migrate dev --name init
```

5. **Run the Development Server:**
```
npm run dev

# or
yarn dev

# or
pnpm dev
``` 
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


6. **Configure Stripe:**

- Set up a Stripe account at Stripe Dashboard.
- Add your Stripe secret and publishable keys to .env.local.
- Test the billing page (/billing) to ensure payment flows work.



## Usage

1. Create a Workflow:

- Use the React Flow interface to design a scraping workflow by dragging and dropping nodes (e.g., Launch Browser, Navigate to URL, Extract Data via AI).
- Configure each node with specific parameters (e.g., CSS selectors, URLs, AI prompts).


2. Execute Scraping:

- Run the workflow to scrape data from target websites.
- Use Puppeteer nodes (e.g., Click Element, Scroll to Element) for dynamic interactions.
- Leverage Together AI for intelligent data extraction, converting HTML to structured JSON.


3. Manage Billing:

- Access the /billing page to subscribe to premium features via Stripe.
- Monitor subscription status and payment history.


4. Export Data:

- Use the Deliver via Webhook node to send scraped data to external APIs.
- Store results in PostgreSQL via Prisma or download as JSON.
