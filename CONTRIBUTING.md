# Contributing

This is an open source project from LemonBrand. We welcome contributions.

## The Philosophy

This tool exists to help freelancers and consultants. Keep it simple. Keep it useful.

**What we want:**
- Bug fixes
- Performance improvements
- New deliverable types that make sense
- Better accessibility
- Documentation improvements

**What we don't want:**
- Scope creep (this is a pricing calculator, not a CRM)
- Dependencies we don't need
- Features that require a backend
- Anything that makes the tool harder to understand

## How to Contribute

### Found a bug?

1. Check if it's already reported in [Issues](https://github.com/lemonbrand/pricing-calc/issues)
2. If not, open a new issue with:
   - What you expected
   - What happened
   - Steps to reproduce
   - Browser/OS if relevant

### Want to add something?

1. Open an issue first to discuss
2. Fork the repo
3. Create a branch (`git checkout -b fix/your-fix` or `git checkout -b feat/your-feature`)
4. Make your changes
5. Test it locally (`npm run dev`)
6. Submit a PR

### Code Style

- TypeScript for everything
- Functional components
- Keep components small and focused
- If a function does one thing, that's perfect

### Commit Messages

Keep them short and descriptive:

```
fix: bundle discount not applying correctly
feat: add hourly rate display to quote summary
docs: clarify complexity multiplier usage
```

## Running Locally

```bash
git clone https://github.com/lemonbrand/pricing-calc.git
cd pricing-calc
npm install
npm run dev
```

## Questions?

Open an issue or reach out at [lemonbrand.io](https://lemonbrand.io).

---

Thanks for helping make this tool better.
