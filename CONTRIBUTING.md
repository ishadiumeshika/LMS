# Contributing to LMS

Thank you for your interest in contributing to the Learning Management System! This document provides guidelines and instructions for contributing to this project.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for database access)
- Git

### Setting Up Development Environment

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/your-username/LMS.git
   cd LMS
   ```

2. **Install Dependencies**
   
   For backend:
   ```bash
   cd backend
   npm install
   ```
   
   For frontend:
   ```bash
   cd frontend
   npm install
   ```

3. **Run the Application**
   
   Start backend (in one terminal):
   ```bash
   cd backend
   npm start
   ```
   
   Start frontend (in another terminal):
   ```bash
   cd frontend
   npm start
   ```

## Development Workflow

### Branch Naming Convention
- Feature: `feature/your-feature-name`
- Bug fix: `bugfix/issue-description`
- Documentation: `docs/what-you-are-documenting`

### Commit Messages
Follow conventional commit format:
- `feat: add new feature`
- `fix: resolve bug in component`
- `docs: update documentation`
- `style: format code`
- `refactor: restructure code`
- `test: add or update tests`
- `chore: update dependencies`

### Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test Your Changes**
   - Test manually in the browser
   - Ensure backend API endpoints work correctly
   - Verify no console errors

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template with:
     - Description of changes
     - Related issue number (if applicable)
     - Screenshots (for UI changes)
     - Testing steps

## Code Style Guidelines

### JavaScript/React
- Use ES6+ syntax
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Keep functions small and focused

### Code Formatting
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays

### File Organization
- Keep related files together
- Use descriptive file names
- Organize imports: external libraries first, then local imports

## What to Contribute

### Good First Issues
- Documentation improvements
- UI/UX enhancements
- Bug fixes
- Adding tests
- Code refactoring

### Feature Requests
Before working on a new feature:
1. Check if an issue exists
2. If not, create an issue to discuss the feature
3. Wait for approval from maintainers
4. Then start working on it

### Bug Reports
When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/environment information

## Testing

### Manual Testing
- Test all user roles (Admin, Center, Instructor, Student)
- Verify authentication and authorization
- Check API endpoints with different inputs
- Test edge cases and error scenarios

### Browser Testing
Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Database Guidelines

### MongoDB Best Practices
- Use proper schema validation
- Index frequently queried fields
- Avoid exposing sensitive data
- Use transactions for multi-document operations
- Keep connection strings secure

## Security Considerations

### Important Rules
- ⚠️ Never commit API keys, passwords, or secrets
- ⚠️ Always use environment variables for sensitive data
- ⚠️ Validate and sanitize user inputs
- ⚠️ Use HTTPS in production
- ⚠️ Implement proper authentication checks
- ⚠️ Follow OWASP security guidelines

## Code Review Process

Pull requests will be reviewed for:
- Code quality and readability
- Adherence to style guidelines
- Proper testing
- Security vulnerabilities
- Performance implications
- Documentation completeness

## Getting Help

If you need help:
- Check existing documentation (README, QUICKSTART, TESTING_GUIDE)
- Search existing issues
- Create a new issue with the "question" label
- Contact the development team

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes
- Project documentation

Thank you for contributing to LMS! 🎓
