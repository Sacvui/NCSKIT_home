# Contributing to ncsStat

Thank you for your interest in contributing to ncsStat! We welcome contributions from the community to make statistical analysis more accessible and secure.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct (standard professional academic conduct).

## How to Contribute

### Reporting Bugs
If you find a bug, please open an issue on our GitHub repository with:
- A clear description of the bug.
- Steps to reproduce the issue.
- Expected vs. actual behavior.
- Screenshots if applicable.

### Suggesting Enhancements
We welcome ideas for new statistical methods or UI improvements. Please open an issue to discuss your suggestion before implementing it.

### Pull Requests
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Ensure your code passes all tests (`npm run type-check`).
5. Commit your changes (`git commit -m 'Add some feature'`).
6. Push to the branch (`git push origin feature/your-feature`).
7. Open a Pull Request.

## Development Setup

1. Clone the repo: `git clone https://github.com/Sacvui/NCSKIT_home.git`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials.
4. Run the development server: `npm run dev`

## Coding Standards
- Use TypeScript for all new code.
- Follow the existing project structure (components, lib, hooks).
- Ensure all R logic is placed in `lib/webr/analyses/`.
- Add tests for new statistical modules in `__tests__`.

## License
By contributing, you agree that your contributions will be licensed under the MIT License.
