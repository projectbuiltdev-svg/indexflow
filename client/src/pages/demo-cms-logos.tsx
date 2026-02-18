import { useEffect } from "react";
import { SiWordpress, SiWix, SiShopify, SiGhost, SiSquarespace, SiWebflow, SiDrupal, SiJoomla, SiMagento, SiBigcommerce } from "react-icons/si";
import indexFlowLogo from "@assets/image_1771351451425.png";

const cmsPartners = [
  { name: "WordPress", icon: SiWordpress, color: "#21759B" },
  { name: "Wix", icon: SiWix, color: "#0C6EFC" },
  { name: "Shopify", icon: SiShopify, color: "#96BF48" },
  { name: "Ghost", icon: SiGhost, color: "#15171A" },
  { name: "Squarespace", icon: SiSquarespace, color: "#000000" },
  { name: "Webflow", icon: SiWebflow, color: "#4353FF" },
  { name: "Drupal", icon: SiDrupal, color: "#0678BE" },
  { name: "Joomla", icon: SiJoomla, color: "#5091CD" },
  { name: "Magento", icon: SiMagento, color: "#EE672F" },
  { name: "BigCommerce", icon: SiBigcommerce, color: "#121118" },
];

export default function DemoCMSLogos() {
  useEffect(() => {
    document.title = "CMS Integrations Demo - indexFlow";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="bg-primary p-6 flex items-center justify-center gap-4">
        <img src={indexFlowLogo} alt="indexFlow" className="h-16" />
        <div className="text-center">
          <p className="text-primary-foreground font-bold text-2xl">Works With Your Existing Website</p>
          <p className="text-primary-foreground/70 text-lg">Seamless integration with all major platforms</p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="grid grid-cols-5 gap-8 max-w-6xl">
          {cmsPartners.map((cms) => (
            <div 
              key={cms.name}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center gap-4 hover:shadow-xl transition-shadow"
            >
              <cms.icon 
                className="w-24 h-24" 
                style={{ color: cms.color }}
              />
              <span className="text-xl font-semibold text-gray-700">{cms.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-200 p-4 text-center">
        <p className="text-gray-500 text-lg">No need to rebuild your website - we integrate with what you already have</p>
      </div>
    </div>
  );
}
