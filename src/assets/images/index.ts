import heroCommunityImg from './bayanihan_hero_community_1793058128465.jpg';
import careMarketImg from './bayanihan_care_market_1793058128478.jpg';
import medicalImg from './category_medical_needs_1793061978986.jpg';
import billsImg from './category_bills_livelihood_1793061980452.jpg';
import housingImg from './category_housing_shelter_1793061980301.jpg';
import educationImg from './category_education_school_1793061980715.jpg';
import { AssistanceCategory } from '../../types';

export const APP_IMAGES = {
  hero: heroCommunityImg,
  categories: {
    medical: medicalImg,
    bills: billsImg,
    food: careMarketImg,
    housing: housingImg,
    education: educationImg,
  },
};

/**
 * Get the bundled image for a specific assistance category with fallbacks
 */
export function getCategoryImageUrl(category: AssistanceCategory): string {
  return APP_IMAGES.categories[category] || APP_IMAGES.categories.food;
}
