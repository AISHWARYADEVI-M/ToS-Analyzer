# Contributing to ToS Guard

Thank you for your interest in contributing to ToS Guard! We welcome contributions from developers of all skill levels.

## 🤝 Ways to Contribute

- **Report bugs** — Found a problem? Open an issue
- **Suggest features** — Have an idea? Let's discuss it
- **Improve documentation** — Help us write better docs
- **Fix bugs** — Submit a pull request
- **Add explanations** — Improve Plain English clause detection
- **Add test cases** — Help us catch regressions
- **Translate** — Add support for new languages

---

## 🚀 Getting Started

### 1. Fork the Repository
Click "Fork" on GitHub to create your own copy

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/TOS_Analyser.git
cd TOS_Analyser
```

### 3. Set Up Development Environment

**Backend:**
```bash
cd backend
python -m venv myenv
source myenv/bin/activate  # Windows: myenv\Scripts\activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

**Extension:**
No setup needed! Load unpacked at `chrome://extensions/`

### 4. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

---

## 💻 Development Workflow

### Running Locally
```bash
# Terminal 1: Backend
cd backend
source myenv/bin/activate
uvicorn main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Browser: Load extension from chrome-extension/ folder
```

### Code Style

**Python (Backend):**
- Use 4-space indentation
- Follow PEP 8
- Add type hints where possible
- Document complex functions

**JavaScript (Frontend/Extension):**
- Use 2-space indentation
- Use const/let, avoid var
- Variables: camelCase
- Components: PascalCase
- Constants: UPPER_SNAKE_CASE

**CSS:**
- Use Tailwind CSS classes in React
- Use vanilla CSS in extension (scoped with #tos-sidebar)
- Comment non-obvious styles

### Testing

Run syntax checks:
```bash
# Python
python -m py_compile backend/analyzer.py backend/main.py

# JavaScript (ESLint not configured yet, but please check manually)
```

---

## 📝 Types of Contributions

### Adding Plain English Explanations

The heart of ToS Guard is the `generate_plain_english()` function in [backend/analyzer.py](backend/analyzer.py).

**To add a new explanation pattern:**

1. Open `backend/analyzer.py`
2. Find the `generate_plain_english()` function
3. Add a new `if` block with your pattern match:

```python
# Example: Detecting "arbitration" clauses
if any(keyword in sentence.lower() for keyword in [
    'arbitration', 'arbitration clause', 'arbitrate disputes'
]):
    return "This means you agree to resolve disputes through arbitration instead of court..."
```

4. Test it with a real ToS
5. Submit a PR with before/after examples

### Improving UI/UX

**Frontend improvements:**
- Edit React components in `frontend/src/`
- Add new Tailwind CSS classes
- Test responsiveness

**Extension improvements:**
- Edit `chrome-extension/content.js` for functionality
- Edit `chrome-extension/sidebar.css` for styling
- Test on various ToS pages

### Adding Features

1. **Backend feature** — Add endpoint to `main.py`, logic to `analyzer.py`
2. **Frontend feature** — Add component to `frontend/src/components/`
3. **Extension feature** — Add functionality to `content.js`

---

## 🧪 Testing

### Manual Testing

1. **Web App:**
   - Test with different URL formats
   - Test with PDF uploads
   - Test with very long text (5000+ words)
   - Test with different risk levels

2. **Extension:**
   - Visit real ToS pages to test auto-detection
   - Verify sidebar doesn't break page layout
   - Test on multiple websites
   - Check console for JavaScript errors

3. **API:**
   - Use curl or Postman to test endpoints
   - Test with edge cases (empty text, very long text, special characters)

### Running Tests
(None exist yet, but we'd love your help setting up pytest!)

---

## 📋 Pull Request Checklist

Before submitting a PR:

- [ ] Code follows project style guide
- [ ] Python syntax is valid (`python -m py_compile`)
- [ ] JavaScript has no obvious errors
- [ ] Documentation is updated
- [ ] Changes are tested locally
- [ ] Commit messages are clear and descriptive
- [ ] No unnecessary whitespace changes
- [ ] No API keys or secrets committed

---

## 🐛 Reporting Bugs

**When reporting a bug, please include:**
- Operating system and browser
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Console errors (F12 > Console tab)

**Example issue:**
```
Title: Extension doesn't detect Facebook ToS page

Description:
When I visit https://www.facebook.com/legal/terms/, the sidebar doesn't appear.

Steps to reproduce:
1. Load extension in Chrome
2. Visit Facebook terms page
3. Wait 5 seconds
4. No sidebar appears

Expected: Sidebar should show analysis
Actual: No sidebar, no console errors (F12 shows clean)

OS: Windows 10
Browser: Chrome 121
```

---

## 💬 Getting Help

- Check existing issues (yours might be answered already)
- Join our discussions
- Email the maintainers
- Read the documentation

---

## 📈 Contribution Ideas by Skill Level

### Beginner
- [ ] Improve README documentation
- [ ] Add examples to API docs
- [ ] Update .gitignore
- [ ] Fix typos
- [ ] Add test cases

### Intermediate
- [ ] Add new Plain English explanation patterns
- [ ] Improve error messages
- [ ] Add new risk categories
- [ ] Refactor existing code
- [ ] Improve CSS styling

### Advanced
- [ ] Add testing framework (pytest)
- [ ] Implement user authentication
- [ ] Add database support
- [ ] Create REST API versioning
- [ ] Build CI/CD pipeline
- [ ] Optimize AI model performance
- [ ] Add caching layer

---

## 🎯 Code Review Process

1. You submit a PR
2. Maintainer reviews code
3. Changes requested (if any)
4. You push updates
5. PR is merged!

**Be patient** — reviews can take a few days during busy periods.

---

## 📚 Useful Resources

- [HuggingFace Transformers Docs](https://huggingface.co/docs/transformers/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React 18 Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)

---

## 🏆 Recognition

Contributors will be:
- Listed in [CONTRIBUTORS.md](CONTRIBUTORS.md) (coming soon)
- Thanked in release notes
- Given credit in GitHub profile

---

## ❓ Questions?

Feel free to:
- Open a discussion
- Comment on an issue
- Reach out to maintainers
- Check existing documentation

---

Thank you for making ToS Guard better! 🎉

Happy coding! 🚀
