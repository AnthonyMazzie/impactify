import { describe, it, expect } from 'vitest';
import { generateImpactStatement } from '../src/index';

describe('generateImpactStatement', () => {
    it('formats correctly with verb at start', () => {
        const result = generateImpactStatement({
            project: 'Upgrade EKS',
            action: 'Upgraded EKS to 1.33',
            businessImpact: 'Improved reliability',
            specificImpact: 'Reduces downtime by 25%',
            goalAlignmentAndFinancials: 'OKR 1.4, saved $200',
        });

        expect(result).toBe(
            'Upgraded EKS to 1.33, which improved reliability, Reduces downtime by 25%. This aligned with OKR 1.4, saved $200.',
        );
    });

    it('formats correctly without verb at start', () => {
        const result = generateImpactStatement({
            project: 'Dual cluster',
            action: 'Deployed dual-region EKS',
            businessImpact: 'Boosted availability',
            specificImpact: '50% fewer alerts',
            goalAlignmentAndFinancials: 'OKR 2.1, saved $500',
        });

        expect(result).toBe(
            'Deployed dual-region EKS, which boosted availability, resulting in 50% fewer alerts. This aligned with OKR 2.1, saved $500.',
        );
    });

    it('handles extra whitespace in specificImpact', () => {
        const result = generateImpactStatement({
            project: 'Reduce latency',
            action: 'Optimized database queries',
            businessImpact: 'Improved performance',
            specificImpact: '   decreases response time by 40%   ',
            goalAlignmentAndFinancials: 'OKR 3.2, reduced support tickets',
        });

        expect(result).toBe(
            'Optimized database queries, which improved performance, decreases response time by 40%. This aligned with OKR 3.2, reduced support tickets.',
        );
    });

    it('handles non-verb specificImpact gracefully', () => {
        const result = generateImpactStatement({
            project: 'Improve CI',
            action: 'Refactored test suite',
            businessImpact: 'Increased developer velocity',
            specificImpact: 'faster feedback cycle',
            goalAlignmentAndFinancials: 'OKR 4.1, saved 5 hours/week',
        });

        expect(result).toBe(
            'Refactored test suite, which increased developer velocity, resulting in faster feedback cycle. This aligned with OKR 4.1, saved 5 hours/week.',
        );
    });

    it('handles missing project field without failure', () => {
        const result = generateImpactStatement({
            action: 'Automated deployment process',
            businessImpact: 'Reduced manual effort',
            specificImpact: 'cuts release time in half',
            goalAlignmentAndFinancials: 'OKR 5.3, saved $1000/month',
        });

        expect(result).toBe(
            'Automated deployment process, which reduced manual effort, cuts release time in half. This aligned with OKR 5.3, saved $1000/month.',
        );
    });

    it('handles empty specificImpact', () => {
        const result = generateImpactStatement({
            project: 'Empty case',
            action: 'Did something',
            businessImpact: 'Improved something',
            specificImpact: '',
            goalAlignmentAndFinancials: 'OKR X',
        });

        expect(result).toBe(
            'One or more required fields are missing or empty. Please provide values for all required fields.'
        );
    });

    it('trims whitespace in all fields', () => {
        const result = generateImpactStatement({
            project: '   Code cleanup   ',
            action: '   Removed unused dependencies   ',
            businessImpact: '   Increased maintainability   ',
            specificImpact: '   reduces bundle size by 15%   ',
            goalAlignmentAndFinancials: '   OKR 8.1, faster builds   ',
        });

        expect(result).toBe(
            'Removed unused dependencies, which increased maintainability, reduces bundle size by 15%. This aligned with OKR 8.1, faster builds.',
        );
    });

    it('handles punctuation in specificImpact', () => {
        const result = generateImpactStatement({
            project: 'Alerts system',
            action: 'Implemented smarter alert routing',
            businessImpact: 'Reduced on-call fatigue',
            specificImpact: 'Improves signal-to-noise ratio!',
            goalAlignmentAndFinancials: 'OKR 7.2, happier engineers',
        });

        expect(result).toBe(
            'Implemented smarter alert routing, which reduced on-call fatigue, Improves signal-to-noise ratio!. This aligned with OKR 7.2, happier engineers.',
        );
    });

    it('handles capitalized verb in specificImpact', () => {
        const result = generateImpactStatement({
            project: 'Metrics overhaul',
            action: 'Redesigned metrics dashboard',
            businessImpact: 'Increased data visibility',
            specificImpact: 'Saves engineers 3 hours/week',
            goalAlignmentAndFinancials: 'OKR 6.1, improved decision making',
        });

        expect(result).toBe(
            'Redesigned metrics dashboard, which increased data visibility, Saves engineers 3 hours/week. This aligned with OKR 6.1, improved decision making.',
        );
    });

    it('handles all-uppercase input gracefully', () => {
        const result = generateImpactStatement({
            project: 'REFACTOR AUTH',
            action: 'REFACTORED AUTH MODULE',
            businessImpact: 'ENHANCED SECURITY',
            specificImpact: 'LOWERS RISK OF BREACH',
            goalAlignmentAndFinancials: 'OKR 9.1, saved compliance cost',
        });

        expect(result).toBe(
            'Refactored auth module, which enhanced security, LOWERS RISK OF BREACH. This aligned with OKR 9.1, saved compliance cost.',
        );
    });

    it('handles very long specificImpact and goalAlignmentAndFinancials fields', () => {
        const result = generateImpactStatement({
            project: 'Improve ML pipeline',
            action: 'Streamlined data ingestion process for ML models',
            businessImpact: 'Improved model training speed and reliability',
            specificImpact: 'reduces model drift and retraining time by over 70% while improving AUC by 15%',
            goalAlignmentAndFinancials: 'OKR 10.2, aligns with AI initiative and avoids $10k/mo cloud costs',
        });

        expect(result).toBe(
            'Streamlined data ingestion process for ML models, which improved model training speed and reliability, reduces model drift and retraining time by over 70% while improving AUC by 15%. This aligned with OKR 10.2, aligns with AI initiative and avoids $10k/mo cloud costs.',
        );
    });

    it('normalizes mixed punctuation and irregular whitespace', () => {
        const result = generateImpactStatement({
            project: 'fix login',
            action: '   Fixed login bug   ',
            businessImpact: '   Increased user retention   ',
            specificImpact: '   saves 200+ sessions/day.   ',
            goalAlignmentAndFinancials: '   OKR 11.4 , supports revenue growth   ',
        });

        expect(result).toBe(
            'Fixed login bug, which increased user retention, saves 200+ sessions/day.. This aligned with OKR 11.4 , supports revenue growth.',
        );
    });

    it('handles all fields missing or empty', () => {
        const result = generateImpactStatement({
            action: '',
            businessImpact: '',
            specificImpact: '',
            goalAlignmentAndFinancials: '',
        });

        expect(result).toBe('One or more required fields are missing or empty. Please provide values for all required fields.');
    });

    it('preserves known acronyms in action', () => {
        const result = generateImpactStatement({
            project: 'API enhancement',
            action: 'IMPROVED API PERFORMANCE',
            businessImpact: 'Enhanced throughput',
            specificImpact: 'cuts response time by 50%',
            goalAlignmentAndFinancials: 'OKR 13.3',
        });

        expect(result).toBe(
            'Improved API performance, which enhanced throughput, cuts response time by 50%. This aligned with OKR 13.3.',
        );
    });

    it('handles qualitative impact without measurable metrics', () => {
        const result = generateImpactStatement({
            project: 'DX Enhancements',
            action: 'Improved onboarding documentation',
            businessImpact: 'Reduced confusion for new developers',
            specificImpact: 'smoother onboarding experience',
            goalAlignmentAndFinancials: 'OKR 12.2, improved retention',
        });

        expect(result).toBe(
            'Improved onboarding documentation, which reduced confusion for new developers, resulting in smoother onboarding experience. This aligned with OKR 12.2, improved retention.'
        );
    });

    it('formats multi-action phrases correctly in the action field', () => {
        const result = generateImpactStatement({
            project: 'Fullstack Revamp',
            action: 'Redesigned UI and migrated backend to Node.js',
            businessImpact: 'Boosted performance and usability',
            specificImpact: 'cuts load times and improves user satisfaction',
            goalAlignmentAndFinancials: 'OKR 14.5, supports customer engagement',
        });

        expect(result).toBe(
            'Redesigned UI and migrated backend to Node.js, which boosted performance and usability, cuts load times and improves user satisfaction. This aligned with OKR 14.5, supports customer engagement.'
        );
    });

    it('handles missing goalAlignmentAndFinancials gracefully', () => {
        const result = generateImpactStatement({
            project: 'DevEx Tools',
            action: 'Built internal CLI tool',
            businessImpact: 'Streamlined local development',
            specificImpact: 'reduces setup time by 70%',
            goalAlignmentAndFinancials: '',
        });

        expect(result).toBe(
            'Built internal CLI tool, which streamlined local development, reduces setup time by 70%. No specific alignment provided.',
        );
    });

    it('handles unknown acronyms or capital words gracefully', () => {
        const result = generateImpactStatement({
            project: 'Pilot UX',
            action: 'Refactored FTW component and PoC widgets',
            businessImpact: 'Enhanced user experience',
            specificImpact: 'boosts engagement rates',
            goalAlignmentAndFinancials: 'OKR 16.3, supports customer retention',
        });

        expect(result).toBe(
            'Refactored FTW component and POC widgets, which enhanced user experience, boosts engagement rates. This aligned with OKR 16.3, supports customer retention.',
        );
    });

    it('handles acronyms in specificImpact and goalAlignmentAndFinancials', () => {
        const result = generateImpactStatement({
            project: 'Monitoring Revamp',
            action: 'Integrated AWS X-Ray into monitoring stack',
            businessImpact: 'Improved observability',
            specificImpact: 'improves MTTR by 40%',
            goalAlignmentAndFinancials: 'OKR 17.6, aligns with SLO targets and SLA guarantees',
        });

        expect(result).toBe(
            'Integrated AWS X-Ray into monitoring stack, which improved observability, improves MTTR by 40%. This aligned with OKR 17.6, aligns with SLO targets and SLA guarantees.',
        );
    });

    it('handles hyphenated phrases in action and impact', () => {
        const result = generateImpactStatement({
            project: 'E2E Testing',
            action: 'Implemented end-to-end testing',
            businessImpact: 'Improved confidence in releases',
            specificImpact: 'reduces post-deploy bugs by 60%',
            goalAlignmentAndFinancials: 'OKR 18.1, fewer hotfixes',
        });
        expect(result).toBe(
            'Implemented end-to-end testing, which improved confidence in releases, reduces post-deploy bugs by 60%. This aligned with OKR 18.1, fewer hotfixes.'
        );
    });

    it('handles acronym followed by punctuation', () => {
        const result = generateImpactStatement({
            project: 'API Gateway',
            action: 'Secured access to API.',
            businessImpact: 'Improved data protection',
            specificImpact: 'reduces unauthorized access incidents',
            goalAlignmentAndFinancials: 'OKR 19.4, improved compliance',
        });
        expect(result).toBe(
            'Secured access to API., which improved data protection, reduces unauthorized access incidents. This aligned with OKR 19.4, improved compliance.'
        );
    });

    it('handles newlines in action and impact', () => {
        const result = generateImpactStatement({
            project: 'Formatting Cleanup',
            action: '  Removed  \n legacy \n line breaks  ',
            businessImpact: 'Cleaned up UI display',
            specificImpact: 'fixes layout issues across pages',
            goalAlignmentAndFinancials: 'OKR 20.1, improved customer experience',
        });
        expect(result).toBe(
            'Removed legacy line breaks, which cleaned up UI display, fixes layout issues across pages. This aligned with OKR 20.1, improved customer experience.'
        );
    });

    it('handles single acronym as the action', () => {
        const result = generateImpactStatement({
            project: 'Proof of Concept',
            action: 'POC',
            businessImpact: 'Validated technical feasibility',
            specificImpact: 'reduces implementation risk',
            goalAlignmentAndFinancials: 'OKR 21.2, accelerated decision making',
        });
        expect(result).toBe(
            'POC, which validated technical feasibility, reduces implementation risk. This aligned with OKR 21.2, accelerated decision making.'
        );
    });

    it('handles specificImpact starting with numbers', () => {
        const result = generateImpactStatement({
            project: 'Billing Optimization',
            action: 'Consolidated invoices',
            businessImpact: 'Reduced complexity',
            specificImpact: '25% fewer billing errors',
            goalAlignmentAndFinancials: 'OKR 22.1, saved $2k/month',
        });
        expect(result).toBe(
            'Consolidated invoices, which reduced complexity, resulting in 25% fewer billing errors. This aligned with OKR 22.1, saved $2k/month.'
        );
    });

    it('handles inline code or quoted text in action', () => {
        const result = generateImpactStatement({
            project: 'Dev Tools',
            action: 'Added support for `--watch` flag in CLI',
            businessImpact: 'Improved DX',
            specificImpact: 'cuts local test loop by 30%',
            goalAlignmentAndFinancials: 'OKR 23.3, improved velocity',
        });
        expect(result).toBe(
            'Added support for `--watch` flag in CLI, which improved DX, cuts local test loop by 30%. This aligned with OKR 23.3, improved velocity.'
        );
    });

    it('handles financial impact with estimated savings', () => {
        const result = generateImpactStatement({
            project: 'Dual-region cluster',
            action: 'Deployed a dual-region EKS cluster',
            businessImpact: 'Increased uptime to over 90%',
            specificImpact: 'Decreased support required by over 10 hours per month',
            goalAlignmentAndFinancials: 'OKR 1.5, saved upwards of $10,000 per year',
        });

        expect(result).toBe(
            'Deployed a dual-region EKS cluster, which increased uptime to over 90%, resulting in decreased support required by over 10 hours per month. This aligned with OKR 1.5, saved upwards of $10,000 per year.'
        );
    });

    it('handles partial input gracefully', () => {
        const result = generateImpactStatement({
            action: 'Automated deployment process',
            businessImpact: '',
            specificImpact: '',
            goalAlignmentAndFinancials: '',
        });

        expect(result).toBe(
            'One or more required fields are missing or empty. Please provide values for all required fields.'
        );
    });

    it('handles long fields gracefully', () => {
        const result = generateImpactStatement({
            project: 'Long project name that exceeds normal length for testing purposes',
            action: 'Completed the most complex task imaginable involving multiple components and technologies to create a system that revolutionized productivity',
            businessImpact: 'The business impact of this is immense as it improved operational efficiency by over 400% and reduced downtime by 99.9%',
            specificImpact: 'Increased profitability by more than 200%, and also improved employee satisfaction by 45%',
            goalAlignmentAndFinancials: 'OKR 99.9, saved $5,000,000 annually through the implementation',
        });

        expect(result).toBe(
            'One or more fields exceed the maximum allowed length. Please reformat them.'
        );
    });

    it('handles numerical inputs gracefully', () => {
        const result = generateImpactStatement({
            project: 'Cost Reduction Project',
            action: 'Automated cost reduction process',
            businessImpact: 'Reduced overall costs',
            specificImpact: 'Reduced costs by 20%',
            goalAlignmentAndFinancials: 'OKR 2.1, saved $500,000',
        });

        expect(result).toBe(
            'Automated cost reduction process, which reduced overall costs, resulting in reduced costs by 20%. This aligned with OKR 2.1, saved $500,000.'
        );
    });

    it('handles fields with empty spaces or unintentional characters', () => {
        const result = generateImpactStatement({
            project: 'Project with space issues  ',
            action: 'Task completed   ',
            businessImpact: 'Impact generated  ',
            specificImpact: '  Output generated  ',
            goalAlignmentAndFinancials: 'OKR X',
        });

        expect(result).toBe(
            'Task completed, which impact generated, resulting in output generated. This aligned with OKR X.'
        );
    });

    it('handles very short inputs gracefully', () => {
        const result = generateImpactStatement({
            project: 'Short input case',
            action: 'Done',
            businessImpact: 'Improved',
            specificImpact: '10%',
            goalAlignmentAndFinancials: 'OKR 1.1',
        });

        expect(result).toBe(
            'Done, which improved, resulting in 10%. This aligned with OKR 1.1.'
        );
    });

    it('handles empty project field gracefully', () => {
        const result = generateImpactStatement({
            project: '',
            action: 'Optimized query performance',
            businessImpact: 'Improved response times',
            specificImpact: 'reduces latency by 30%',
            goalAlignmentAndFinancials: 'OKR 3.1, improved efficiency',
        });

        expect(result).toBe(
            'Optimized query performance, which improved response times, reduces latency by 30%. This aligned with OKR 3.1, improved efficiency.'
        );
    });

    it('handles qualitative vs quantitative impact gracefully', () => {
        const result = generateImpactStatement({
            project: 'Customer Experience',
            action: 'Improved UI design',
            businessImpact: 'Increased user satisfaction',
            specificImpact: 'Improved NPS by 15%',
            goalAlignmentAndFinancials: 'OKR 4.2, enhanced user retention',
        });

        expect(result).toBe(
            'Improved UI design, which increased user satisfaction, resulting in improved NPS by 15%. This aligned with OKR 4.2, enhanced user retention.'
        );
    });

    it('handles mixed-case acronyms in input', () => {
        const result = generateImpactStatement({
            project: 'API integration',
            action: 'Implemented new API integration',
            businessImpact: 'Boosted API usage',
            specificImpact: 'Increased API calls by 40%',
            goalAlignmentAndFinancials: 'OKR 5.1, improved system reliability',
        });

        expect(result).toBe(
            'Implemented new API integration, which boosted API usage, resulting in increased API calls by 40%. This aligned with OKR 5.1, improved system reliability.'
        );
    });

});
