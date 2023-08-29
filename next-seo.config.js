const title = 'RKSM | Laboratory Equipment Solution in Nepal';
const description =
    'We provide a wide range of laboratory equipment and services for schools and colleges in Nepal. Our team of experts can help you choose the right equipment for your needs, and we offer installation, demonstration, and training services to ensure that you get the most out of your investment.';
const url = 'https://rksm.netlify.app';

const SEO = {
    title,
    description,
    canonical: url,
    openGraph: {
        type: 'website',
        url,
        title,
        description,
        images: [
            {
                url: `/splash.webp`,
                alt: title,
            },
        ],
    },
    // twitter: {
    //     cardType: 'summary_large_image',
    //     handle: '@hendraaagil',
    //     site: '@hendraaagil',
    // },
    additionalLinkTags: [{ rel: 'icon', href: '/favicon.ico' }],
};

export default SEO;