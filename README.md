# LightNote

**LightNote** is your creative canvas—where thoughts become notes, ideas connect, and inspiration flows. A modern, feature-rich note-taking application built with Next.js, designed for clarity, simplicity, and powerful organization.

![LightNote Logo](public/LightNote-full-readme.svg)

## ✨ Features

- **📝 Rich Text Editor**: Powered by Tiptap with full markdown support and formatting options
- **📚 Notebook Organization**: Create and organize notes in customizable notebooks with emoji icons
- **⭐ Favorites System**: Mark important notes as favorites for quick access
- **🔍 Smart Search**: Find notes and notebooks instantly with intelligent search
- **🎨 Dark/Light Theme**: Beautiful UI with theme switching support
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **🔐 Secure Authentication**: Email/password authentication with email verification
- **💾 Auto-Save**: Your work is automatically saved as you type
- **🗃️ Drag & Drop**: Intuitive sidebar navigation with collapsible sections

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with email verification
- **Rich Text**: Tiptap Editor with Starter Kit
- **UI Components**: shadcn/ui component library
- **Email**: Resend for transactional emails
- **Deployment**: Vercel-ready

## 🛠️ Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm/yarn/pnpm

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lightnote"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
```

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JyotirmoyDas05/LightNote.git
   cd LightNote
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up the database**
   ```bash
   # Generate and run migrations
   npm run db:generate
   npm run db:migrate
   
   # Or using yarn
   yarn db:generate
   yarn db:migrate
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see LightNote in action!

## 📁 Project Structure

```
LightNote/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── emails/           # Email templates
├── db/                   # Database configuration
│   ├── schema.ts         # Drizzle schema
│   └── drizzle.ts        # Database connection
├── lib/                  # Utility functions
├── server/               # Server actions
└── public/               # Static assets
```

## 🎯 Core Features

### Rich Text Editing
- **Markdown Support**: Type `**bold**`, `*italic*`, `# heading` and more
- **Keyboard Shortcuts**: `Ctrl+B` for bold, `Ctrl+I` for italic, etc.
- **Formatting Tools**: Bold, italic, strikethrough, code, lists, headings
- **Live Preview**: See your formatting in real-time

### Organization System
- **Notebooks**: Group related notes together
- **Emoji Icons**: Customize notebooks and notes with emojis
- **Favorites**: Quick access to important notes
- **Search**: Find content across all notes and notebooks

### User Experience
- **Auto-Save**: Changes are saved automatically
- **Responsive**: Works on all screen sizes
- **Theme Support**: Dark and light mode
- **Accessibility**: Built with accessibility in mind

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables**
4. **Deploy**

The app is optimized for Vercel deployment with automatic builds and previews.

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tiptap](https://tiptap.dev/) - Rich text editor
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Better Auth](https://better-auth.com/) - Authentication library

## 📧 Contact

**Jyotirmoy Das** - [jyotimoydas12345@gmail.com](mailto:jyotimoydas12345@gmail.com)

Project Link: [https://github.com/JyotirmoyDas05/LightNote](https://github.com/JyotirmoyDas05/LightNote)

---

*Built with ❤️ by [Jyotirmoy Das](https://github.com/JyotirmoyDas05)*
