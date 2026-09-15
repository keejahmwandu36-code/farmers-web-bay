export const heroStats = [
    { label: 'Soil moisture tracked', value: '24/7' },
    { label: 'Alert response time', value: '< 60s' },
    { label: 'Works offline', value: 'Yes' },
    { label: 'Mobile-first', value: 'Designed' },
];

export const features = [
    {
        title: 'Live Field Monitoring',
        description:
            'Soil moisture, temperature, and humidity readings update on your dashboard in real time — no page refresh needed.',
    },
    {
        title: 'Instant Alerts',
        description:
            'Get notified the moment soil moisture drops below the level your crop needs. Act before the field suffers.',
    },
    {
        title: 'History & Trends',
        description:
            'See how your fields have behaved over days and weeks. Spot patterns, plan irrigation, and compare seasons.',
    },
    {
        title: 'Low-Bandwidth Friendly',
        description:
            'Built for rural connectivity. Sensor devices buffer readings when offline and sync when the network returns.',
    },
    {
        title: 'Mobile First',
        description:
            'Designed to work well on a phone in the field, not just a desktop in an office.',
    },
    {
        title: 'Secure by Default',
        description:
            'Your farm data is yours. Each farmer sees only their own fields, protected by token-based authentication.',
    },
];

export const soilGuide = [
    {
        range: 'Below 30%',
        label: 'Critically dry',
        advice:
            'Most crops will be stressed. Irrigate as soon as possible — especially during flowering or grain-fill stages.',
        tone: 'danger',
    },
    {
        range: '30 – 50%',
        label: 'Adequate',
        advice:
            'Good for most maize, sorghum, and legume crops. Keep monitoring daily, especially in hot weather.',
        tone: 'warning',
    },
    {
        range: '50 – 70%',
        label: 'Healthy range',
        advice:
            'Ideal for most field crops. Roots have good access to water without waterlogging.',
        tone: 'success',
    },
    {
        range: 'Above 70%',
        label: 'Very wet',
        advice:
            'Risk of root disease and nutrient leaching. Improve drainage if this persists after heavy rain.',
        tone: 'info',
    },
];

export const cropTips = [
    {
        crop: 'Maize',
        needs: 'Regular moisture, especially at tasseling and grain fill',
        minMoisture: '30%',
        note: 'Avoid moisture stress during the 2 weeks around flowering.',
    },
    {
        crop: 'Groundnuts',
        needs: 'Moderate, well-drained soil',
        minMoisture: '35%',
        note: 'Too much water causes pod rot. Aim for consistent, moderate moisture.',
    },
    {
        crop: 'Soybeans',
        needs: 'Steady moisture during pod development',
        minMoisture: '35%',
        note: 'Sensitive to drought during pod fill — watch closely then.',
    },
    {
        crop: 'Vegetables (tomato, onion)',
        needs: 'Frequent, shallow irrigation',
        minMoisture: '40%',
        note: 'Small daily changes in moisture stress the plants more than larger weekly swings.',
    },
    {
        crop: 'Sorghum',
        needs: 'Drought-tolerant; can handle short dry spells',
        minMoisture: '25%',
        note: 'Good choice where rainfall is unpredictable, but still benefits from irrigation at flowering.',
    },
];

export const faqs = [
    {
        question: 'Do I need internet in the field?',
        answer:
            'The sensor device buffers readings when it loses connection and sends them in batches once the network returns. You only need connectivity long enough to sync.',
    },
    {
        question: 'How often does the system take readings?',
        answer:
            'Default is every 15 minutes. This can be adjusted per field based on crop and season.',
    },
    {
        question: 'Can I monitor more than one field?',
        answer:
            'Yes. Each farmer account can have multiple farms, and each farm multiple fields — each with its own device and thresholds.',
    },
    {
        question: 'What if my soil moisture drops at night?',
        answer:
            "The system checks every reading against your field's minimum threshold. Alerts are created as soon as a breach is detected, day or night.",
    },
    {
        question: 'Is my data private?',
        answer:
            'Yes. Every field is protected — only the farmer who owns it can see its readings and alerts.',
    },
];