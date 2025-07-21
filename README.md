# impactify

![Node.js](https://img.shields.io/badge/Node.js-v22.16-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)
![GitHub](https://img.shields.io/github/license/AnthonyMazzie/impactify)
![npm](https://img.shields.io/npm/v/impactify)
![npm](https://img.shields.io/npm/dt/impactify)

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Basic Usage](#basic-usage)
5. [Contributing](#contributing)
6. [License](#license)

## Introduction
Let’s be honest, engineers are great at building things, but when it comes to explaining the impact of what we've built, it’s not always easy. We know we’ve improved performance, saved time, or reduced costs, but putting that into words that actually make sense to others? That’s the tricky part.

That’s where impactify comes in. It helps you turn your work into a clear, concise impact statement in seconds. You just tell it what you did, how it helped the business, and what results you achieved. It’ll clean everything up and format it perfectly. No worrying about punctuation, capitalization, or handling acronyms.

Plus, once you have your statement, you can export it in multiple formats: print it out, save it to JSON, Markdown, or just copy it directly to your clipboard for easy sharing.

## Features
- **Automatic Formatting**: You give it the details, and impactify makes sure everything’s formatted right—punctuation, capitalization, and all.
- **Acronym Handling**: It keeps your acronyms looking right by preserving their case.
- **Whitespace Cleanup**: It takes care of any excess spaces, so your statement is neat and tidy.
- **Field Validation**: It checks if you missed anything or went over the character limit, so you don’t have to worry about it.
- **Flexible Export Options**: Once your impact statement is generated, you can easily print it, save it as JSON or Markdown, or copy it to your clipboard.

## Installation

You can install `impactify` globally for easy command-line use:

```bash
npm install -g impactify
```

## Basic Usage

### Command-Line Usage

Once `impactify` is installed globally, you can run it from the command line to quickly generate impact statements based on your inputs. The tool will prompt you for key details like:

- **Project**: Name of the feature or project.
- **Action**: What you did, from technical tasks to key improvements.
- **Business Impact**: How your work improved or benefited the company (e.g., scaling, efficiency, or revenue).
- **Specific Impact**: The measurable results you achieved, such as time saved, efficiency gained, or financial impact.
- **Goal Alignment & Financials**: How your work connects to specific company goals or bottom-line results (e.g., OKRs, cost savings).

To get started, just type:

```bash
impactify
```

Follow the prompts, and `impactify` will generate a perfectly formatted impact statement ready for use in reports, presentations, or your next job application.

#### Inputs

- **Project**: `Microservices Refactor`
- **Action**: `Refactored legacy monolithic app into a set of microservices using Node.js and Docker`
- **Business Impact**: `Improved system scalability and maintainability, allowing faster feature deployment`
- **Specific Impact**: `Reduced app deployment time by 60% and improved system uptime by 99.9%`
- **Goal Alignment & Financials**: `OKR 2.3, saved $50k annually in infrastructure costs by optimizing resource usage`

#### Output

Refactored legacy monolithic app into a set of microservices using Node.js and Docker, which improved system scalability and maintainability, resulting in reduced app deployment time by 60% and improved system uptime by 99.9%. This aligned with OKR 2.3, saved $50k annually in infrastructure costs by optimizing resource usage.


## Contributing

### Support the project
If you find this library helpful and want to support its development, consider [buying me a coffee](https://www.buymeacoffee.com/anthonymazzie) ☕. Your support fuels my ability to keep building great tools for the community!

### How to contribute
1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes and commit them (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature-branch).
5. Open a pull request back to the `anthonymazzie/impactify` repo.

For large changes, [open an issue](https://github.com/AnthonyMazzie/impactify/issues) first to discuss the potential implementation.

## License
This project is licensed under the MIT License.

---

[Return to top](#impactify)