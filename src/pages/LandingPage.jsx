import HeroSection from "../components/HeroSection";
import CallToActionSection from "../components/CallToAction";
import FeaturesSection from "../components/FeaturesSection";

const LandingPage = () => {
	return (
        <div className="w-full">
            <HeroSection />
            <FeaturesSection />
            <CallToActionSection />
        </div>
	);
};

export default LandingPage;
