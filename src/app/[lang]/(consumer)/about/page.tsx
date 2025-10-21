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
                    card1title: 'Tiêu đề 1',
                    card1des: 'Mô tả 1',
                    card2title: 'Tiêu đề 2',
                    card2des: 'Mô tả 2',
                    card3title: 'Tiêu đề 3',
                    card3des: 'Mô tả 3',
                },
            },
            aboutUs: {
                title: 'Về Chúng Tôi',
                titledes:
                    'Chúng tôi tận tâm phát triển trí tuệ trẻ, khơi dậy tò mò và tạo môi trường hỗ trợ để mỗi học sinh phát triển.',
            },
            other: {
                title: 'Hội Tụ Hoạt Động, Thể Thao và Học Thuật Chất Lượng',
                des: 'Trường cân bằng học thuật, thể thao và hoạt động ngoại khóa để phát triển toàn diện và khơi dậy đam mê học tập.',
                link: 'Tham Gia Ngay',
            },
            members: {
                title: 'Nâng Cao Kỹ Năng, Gặp Gỡ Đội Ngũ',
                des1: 'Đội ngũ gồm những giáo viên IT nhiệt huyết và chuyên gia trong ngành, giúp học viên đạt mục tiêu.',
                des2: 'Chúng tôi tin mọi người xứng đáng tiếp cận giáo dục chất lượng, vì vậy tạo nền tảng giúp học IT dễ tiếp cận, thú vị và hiệu quả. Chúng tôi còn tập trung phát triển kỹ năng toàn diện, giải quyết vấn đề và tư duy phản biện.',
                des3: 'Nền tảng giúp học IT dễ tiếp cận và thú vị, trong khi giáo viên hướng dẫn phát triển kỹ năng toàn diện và tư duy cho tương lai.',
            },
            quotes: {
                card1title: 'Tiêu đề 1',
                card1des: 'Mô tả 1',
                card2title: 'Tiêu đề 2',
                card2des: 'Mô tả 2',
                card3title: 'Tiêu đề 3',
                card3des: 'Mô tả 3',
                card4title: 'Tiêu đề 4',
                card4des: 'Mô tả 4',
                card5title: 'Tiêu đề 5',
                card5des: 'Mô tả 5',
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
                    card1title: 'card 1 title',
                    card1des: 'card 1 description',
                    card2title: 'card 2 title',
                    card2des: 'card 2 description',
                    card3title: 'card 3 title',
                    card3des: 'card 3 description',
                },
            },
            aboutUs: {
                title: 'About Us',
                titledes:
                    'We are dedicated to nurturing young minds, fostering curiosity, and providing a supportive environment where every student can thrive.',
            },
            other: {
                title: 'We offer a high Quality Blend of Co-Curricular Activities, Sports and Academics',
                des: 'Our school balances academics, sports, and co-curricular activities to foster well-rounded development and ignite every student’s passion for learning.',
                link: 'Join Today',
            },
            members: {
                title: 'Improving Skills, Meet our team',
                des1: 'Our Team is composed of passionate IT educators and industry professionals who are dedicated to helping learners achieve their goals.',
                des2: 'We believe that everyone deserves access to top-notch education, and that is why we have built a platform that makes IT skills approachable, engaging, and effective. But we know that mastering technology is just one step in personal and professional growth, which is why our instructors focus on developing well-rounded skills, problem-solving abilities, and critical thinking alongside technical knowledge. Our team is constantly researching emerging trends and creating new courses to keep learners ahead in the fast-paced tech industry.',
                des3: 'Our platform makes IT skills approachable and engaging, while our instructors guide learners in building well-rounded skills, problem-solving, and critical thinking for future growth.',
            },
            quotes: {
                card1title: 'card 1 title',
                card1des: 'card 1 description',
                card2title: 'card 2 title',
                card2des: 'card 2 description',
                card3title: 'card 3 title',
                card3des: 'card 3 description',
                card4title: 'card 4 title',
                card4des: 'card 4 description',
                card5title: 'card 5 title',
                card5des: 'card 5 description',
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
