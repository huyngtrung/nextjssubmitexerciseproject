import AboutClient from '@/components/about/AboutClient';

type Lang = 'vi' | 'en';

type AboutPageTexts = {
    layout: {
        nav: {
            home: string;
            about: string;
        };
    };
    about: {
        header: {
            title: string;
        };
        visionMission: {
            title: string;
            card: {
                card1title: string;
                card1des: string;
                card2title: string;
                card2des: string;
                card3title: string;
                card3des: string;
            };
        };
        aboutUs: {
            title: string;
            titledes: string;
        };
        other: {
            title: string;
            des: string;
            link: string;
        };

        members: {
            title: string;
            des1: string;
            des2: string;
            des3: string;
        };
        quotes: {
            card1title: string;
            card1des: string;
            card2title: string;
            card2des: string;
            card3title: string;
            card3des: string;
            card4title: string;
            card4des: string;
            card5title: string;
            card5des: string;
        };
    };
};

const texts: Record<Lang, AboutPageTexts> = {
    vi: {
        layout: {
            nav: {
                home: 'Trang Chủ',
                about: 'Giới Thiệu',
            },
        },
        about: {
            header: {
                title: 'Giới Thiệu',
            },
            visionMission: {
                title: 'Tầm Nhìn & Sứ Mệnh',
                card: {
                    card1title: 'Hỗ Trợ Học Sinh Toàn Diện',
                    card1des:
                        'Cung cấp nền tảng làm bài tập và hướng dẫn chi tiết giúp học sinh nắm vững kiến thức.',
                    card2title: 'Phát Triển Kỹ Năng Tư Duy',
                    card2des:
                        'Rèn luyện khả năng giải quyết vấn đề, tư duy sáng tạo và tự học hiệu quả.',
                    card3title: 'Tạo Môi Trường Học Tập Tích Cực',
                    card3des:
                        'Khuyến khích sự hứng thú, sáng tạo và chủ động trong học tập hàng ngày.',
                },
            },
            aboutUs: {
                title: 'Về Chúng Tôi',
                titledes:
                    'Chúng tôi tận tâm phát triển trí tuệ trẻ, khơi dậy tò mò và tạo môi trường hỗ trợ để mỗi học sinh phát triển toàn diện. Nền tảng của chúng tôi cung cấp bài tập, hướng dẫn chi tiết và các hoạt động học tập thú vị giúp học sinh rèn luyện kỹ năng, nâng cao kiến thức và tự tin hơn trong học tập hàng ngày.',
            },
            other: {
                title: 'Nền Tảng Học Tập Toàn Diện Cho Học Sinh',
                des: 'Khám phá môi trường học tập sáng tạo, đầy đủ bài tập và hướng dẫn chi tiết, giúp học sinh nâng cao kiến thức, kỹ năng và tự tin trong học tập hàng ngày.',
                link: 'Bắt Đầu Ngay',
            },
            members: {
                title: 'Gặp Gỡ Đội Ngũ Phát Triển Ứng Dụng',
                des1: 'Nhóm chúng tôi gồm những chuyên gia phát triển, thiết kế và nội dung giáo dục, làm việc cùng nhau để tạo ra nền tảng học tập hiệu quả và thân thiện với học sinh.',
                des2: 'Chúng tôi tin rằng mọi học sinh đều xứng đáng tiếp cận giáo dục chất lượng. Vì vậy, nền tảng được thiết kế dễ sử dụng, thú vị và hỗ trợ tối đa trong việc làm bài tập, rèn luyện kỹ năng và tư duy phản biện.',
                des3: 'Đội ngũ phát triển cam kết mang đến trải nghiệm học tập trực tuyến sáng tạo và toàn diện, giúp học sinh tự tin học tập và khám phá tri thức mỗi ngày.',
            },
            quotes: {
                card1title: 'Kiên Nhẫn Học Tập',
                card1des:
                    'Mỗi bài tập là một bước tiến nhỏ trên con đường khám phá kiến thức. Hãy kiên nhẫn và nỗ lực mỗi ngày.',

                card2title: 'Tò Mò và Khám Phá',
                card2des:
                    'Sự tò mò sẽ dẫn bạn đến những phát hiện mới. Hãy hỏi, tìm hiểu và học hỏi không ngừng.',

                card3title: 'Tự Tin Làm Bài Tập',
                card3des:
                    'Tin vào khả năng của bản thân, từng bước hoàn thành bài tập sẽ giúp bạn tự tin hơn mỗi ngày.',

                card4title: 'Học Từ Sai Lầm',
                card4des:
                    'Mỗi lỗi sai là cơ hội để cải thiện. Hãy học từ chúng và không ngừng tiến bộ.',

                card5title: 'Sáng Tạo Trong Học Tập',
                card5des:
                    'Đừng ngại nghĩ khác và tìm cách riêng để giải quyết vấn đề. Sáng tạo giúp học tập trở nên thú vị và hiệu quả.',
            },
        },
    },
    en: {
        layout: {
            nav: {
                home: 'Home',
                about: 'About',
            },
        },
        about: {
            header: {
                title: 'About',
            },
            visionMission: {
                title: 'Vision & Mission',
                card: {
                    card1title: 'Comprehensive Student Support',
                    card1des:
                        'Provide a platform for assignments and detailed guidance to help students master knowledge.',
                    card2title: 'Develop Thinking Skills',
                    card2des:
                        'Cultivate problem-solving, creative thinking, and effective self-learning skills.',
                    card3title: 'Create a Positive Learning Environment',
                    card3des: 'Encourage enthusiasm, creativity, and active learning every day.',
                },
            },
            aboutUs: {
                title: 'About Us',
                titledes:
                    'We are dedicated to developing young minds, sparking curiosity, and providing a supportive environment for every student to grow. Our platform offers assignments, detailed guidance, and engaging learning activities that help students strengthen skills, enhance knowledge, and gain confidence in their daily studies.',
            },
            other: {
                title: 'Comprehensive Learning Platform for Students',
                des: 'Discover a creative learning environment with complete assignments and detailed guidance, helping students enhance knowledge, skills, and confidence in their daily studies.',
                link: 'Get Started Now',
            },
            members: {
                title: 'Meet Our App Team',
                des1: 'Our team consists of developers, designers, and educational content experts working together to create an effective and student-friendly learning platform.',
                des2: 'We believe every student deserves access to quality education. Therefore, the platform is designed to be easy to use, engaging, and supportive for completing assignments, building skills, and developing critical thinking.',
                des3: 'The development team is committed to delivering a creative and comprehensive online learning experience, helping students confidently learn and explore knowledge every day.',
            },
            quotes: {
                card1title: 'Patience in Learning',
                card1des:
                    'Every assignment is a small step on the journey of discovering knowledge. Be patient and strive every day.',

                card2title: 'Curiosity and Exploration',
                card2des:
                    'Curiosity leads to new discoveries. Ask questions, explore, and keep learning continuously.',

                card3title: 'Confidence in Assignments',
                card3des:
                    'Believe in yourself. Completing assignments step by step will help you gain confidence every day.',

                card4title: 'Learning from Mistakes',
                card4des:
                    'Every mistake is an opportunity to improve. Learn from them and keep progressing.',

                card5title: 'Creativity in Learning',
                card5des:
                    'Don’t hesitate to think differently and find your own way to solve problems. Creativity makes learning fun and effective.',
            },
        },
    },
};

function getTextsForLang(lang: string): AboutPageTexts {
    if (lang === 'vi') return texts.vi;
    if (lang === 'en') return texts.en;
    return texts.en;
}

export default async function AboutPage({ params }: { params: Promise<{ lang: 'vi' | 'en' }> }) {
    const { lang } = await params;
    const textsForLang = getTextsForLang(lang);

    return (
        <div>
            {/* Có thể thêm header tĩnh hoặc breadcrumb server-side nếu muốn */}
            <AboutClient lang={lang} textsForLang={textsForLang} />
        </div>
    );
}
