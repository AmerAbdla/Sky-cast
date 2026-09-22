// Comprehensive dataset of major world cities with coordinates, English & Arabic names, and display tiers.
// Tier 1: Megacities & continental hubs (visible at zoom >= 2)
// Tier 2: Major national capitals & metropolises (visible at zoom >= 4)
// Tier 3: Important regional cities & cultural hubs (visible at zoom >= 6)

export const WORLD_CITIES = [
  // ── Arab World & Middle East ─────────────────────────────────
  { id: "riyadh", name: "Riyadh", nameAr: "الرياض", country: "Saudi Arabia", countryCode: "SA", latitude: 24.7136, longitude: 46.6753, tier: 1 },
  { id: "jeddah", name: "Jeddah", nameAr: "جدة", country: "Saudi Arabia", countryCode: "SA", latitude: 21.4858, longitude: 39.1925, tier: 2 },
  { id: "mecca", name: "Mecca", nameAr: "مكة المكرمة", country: "Saudi Arabia", countryCode: "SA", latitude: 21.3891, longitude: 39.8579, tier: 2 },
  { id: "medina", name: "Medina", nameAr: "المدينة المنورة", country: "Saudi Arabia", countryCode: "SA", latitude: 24.5247, longitude: 39.5692, tier: 2 },
  { id: "dammam", name: "Dammam", nameAr: "الدمام", country: "Saudi Arabia", countryCode: "SA", latitude: 26.4207, longitude: 50.0888, tier: 3 },
  { id: "cairo", name: "Cairo", nameAr: "القاهرة", country: "Egypt", countryCode: "EG", latitude: 30.0444, longitude: 31.2357, tier: 1 },
  { id: "alexandria", name: "Alexandria", nameAr: "الإسكندرية", country: "Egypt", countryCode: "EG", latitude: 31.2001, longitude: 29.9187, tier: 2 },
  { id: "luxor", name: "Luxor", nameAr: "الأقصر", country: "Egypt", countryCode: "EG", latitude: 25.6872, longitude: 32.6396, tier: 3 },
  { id: "aswan", name: "Aswan", nameAr: "أسوان", country: "Egypt", countryCode: "EG", latitude: 24.0889, longitude: 32.8998, tier: 3 },
  { id: "dubai", name: "Dubai", nameAr: "دبي", country: "United Arab Emirates", countryCode: "AE", latitude: 25.2048, longitude: 55.2708, tier: 1 },
  { id: "abu-dhabi", name: "Abu Dhabi", nameAr: "أبوظبي", country: "United Arab Emirates", countryCode: "AE", latitude: 24.4539, longitude: 54.3773, tier: 2 },
  { id: "sharjah", name: "Sharjah", nameAr: "الشارقة", country: "United Arab Emirates", countryCode: "AE", latitude: 25.3463, longitude: 55.4209, tier: 3 },
  { id: "doha", name: "Doha", nameAr: "الدوحة", country: "Qatar", countryCode: "QA", latitude: 25.2854, longitude: 51.5310, tier: 2 },
  { id: "kuwait-city", name: "Kuwait City", nameAr: "مدينة الكويت", country: "Kuwait", countryCode: "KW", latitude: 29.3759, longitude: 47.9774, tier: 2 },
  { id: "manama", name: "Manama", nameAr: "المنامة", country: "Bahrain", countryCode: "BH", latitude: 26.2285, longitude: 50.5860, tier: 2 },
  { id: "muscat", name: "Muscat", nameAr: "مسقط", country: "Oman", countryCode: "OM", latitude: 23.5880, longitude: 58.3829, tier: 2 },
  { id: "salalah", name: "Salalah", nameAr: "صلالة", country: "Oman", countryCode: "OM", latitude: 17.0151, longitude: 54.0924, tier: 3 },
  { id: "khartoum", name: "Khartoum", nameAr: "الخرطوم", country: "Sudan", countryCode: "SD", latitude: 15.5007, longitude: 32.5599, tier: 1 },
  { id: "port-sudan", name: "Port Sudan", nameAr: "بورتسودان", country: "Sudan", countryCode: "SD", latitude: 19.6175, longitude: 37.2164, tier: 3 },
  { id: "baghdad", name: "Baghdad", nameAr: "بغداد", country: "Iraq", countryCode: "IQ", latitude: 33.3152, longitude: 44.3661, tier: 1 },
  { id: "basra", name: "Basra", nameAr: "البصرة", country: "Iraq", countryCode: "IQ", latitude: 30.5081, longitude: 47.7835, tier: 2 },
  { id: "erbil", name: "Erbil", nameAr: "أربيل", country: "Iraq", countryCode: "IQ", latitude: 36.1911, longitude: 44.0092, tier: 3 },
  { id: "damascus", name: "Damascus", nameAr: "دمشق", country: "Syria", countryCode: "SY", latitude: 33.5138, longitude: 36.2765, tier: 2 },
  { id: "aleppo", name: "Aleppo", nameAr: "حلب", country: "Syria", countryCode: "SY", latitude: 36.2021, longitude: 37.1343, tier: 3 },
  { id: "amman", name: "Amman", nameAr: "عمّان", country: "Jordan", countryCode: "JO", latitude: 31.9454, longitude: 35.9284, tier: 2 },
  { id: "aqaba", name: "Aqaba", nameAr: "العقبة", country: "Jordan", countryCode: "JO", latitude: 29.5320, longitude: 35.0063, tier: 3 },
  { id: "beirut", name: "Beirut", nameAr: "بيروت", country: "Lebanon", countryCode: "LB", latitude: 33.8938, longitude: 35.5018, tier: 2 },
  { id: "jerusalem", name: "Jerusalem", nameAr: "القدس", country: "Palestine", countryCode: "PS", latitude: 31.7683, longitude: 35.2137, tier: 2 },
  { id: "gaza", name: "Gaza", nameAr: "غزة", country: "Palestine", countryCode: "PS", latitude: 31.5017, longitude: 34.4668, tier: 3 },
  { id: "sanaa", name: "Sana'a", nameAr: "صنعاء", country: "Yemen", countryCode: "YE", latitude: 15.3694, longitude: 44.1910, tier: 2 },
  { id: "aden", name: "Aden", nameAr: "عدن", country: "Yemen", countryCode: "YE", latitude: 12.7855, longitude: 45.0187, tier: 3 },
  { id: "casablanca", name: "Casablanca", nameAr: "الدار البيضاء", country: "Morocco", countryCode: "MA", latitude: 33.5731, longitude: -7.5898, tier: 1 },
  { id: "rabat", name: "Rabat", nameAr: "الرباط", country: "Morocco", countryCode: "MA", latitude: 34.0209, longitude: -6.8416, tier: 2 },
  { id: "marrakech", name: "Marrakech", nameAr: "مراكش", country: "Morocco", countryCode: "MA", latitude: 31.6295, longitude: -7.9811, tier: 2 },
  { id: "tangier", name: "Tangier", nameAr: "طنجة", country: "Morocco", countryCode: "MA", latitude: 35.7595, longitude: -5.8340, tier: 3 },
  { id: "algiers", name: "Algiers", nameAr: "الجزائر", country: "Algeria", countryCode: "DZ", latitude: 36.7538, longitude: 3.0588, tier: 2 },
  { id: "oran", name: "Oran", nameAr: "وهران", country: "Algeria", countryCode: "DZ", latitude: 35.6987, longitude: -0.6349, tier: 3 },
  { id: "tunis", name: "Tunis", nameAr: "تونس", country: "Tunisia", countryCode: "TN", latitude: 36.8065, longitude: 10.1815, tier: 2 },
  { id: "sfax", name: "Sfax", nameAr: "صفاقس", country: "Tunisia", countryCode: "TN", latitude: 34.7406, longitude: 10.7603, tier: 3 },
  { id: "tripoli", name: "Tripoli", nameAr: "طرابلس", country: "Libya", countryCode: "LY", latitude: 32.8872, longitude: 13.1913, tier: 2 },
  { id: "benghazi", name: "Benghazi", nameAr: "بنغازي", country: "Libya", countryCode: "LY", latitude: 32.1166, longitude: 20.0686, tier: 3 },
  { id: "nouakchott", name: "Nouakchott", nameAr: "نواكشوط", country: "Mauritania", countryCode: "MR", latitude: 18.0735, longitude: -15.9582, tier: 2 },
  { id: "mogadishu", name: "Mogadishu", nameAr: "مقديشو", country: "Somalia", countryCode: "SO", latitude: 2.0469, longitude: 45.3182, tier: 2 },
  { id: "djibouti", name: "Djibouti", nameAr: "جيبوتي", country: "Djibouti", countryCode: "DJ", latitude: 11.5721, longitude: 43.1456, tier: 3 },

  // ── Europe ────────────────────────────────────────────────────
  { id: "london", name: "London", nameAr: "لندن", country: "United Kingdom", countryCode: "GB", latitude: 51.5074, longitude: -0.1278, tier: 1 },
  { id: "manchester", name: "Manchester", nameAr: "مانشستر", country: "United Kingdom", countryCode: "GB", latitude: 53.4808, longitude: -2.2426, tier: 3 },
  { id: "edinburgh", name: "Edinburgh", nameAr: "إدنبرة", country: "United Kingdom", countryCode: "GB", latitude: 55.9533, longitude: -3.1883, tier: 3 },
  { id: "paris", name: "Paris", nameAr: "باريس", country: "France", countryCode: "FR", latitude: 48.8566, longitude: 2.3522, tier: 1 },
  { id: "marseille", name: "Marseille", nameAr: "مارسيليا", country: "France", countryCode: "FR", latitude: 43.2965, longitude: 5.3698, tier: 3 },
  { id: "lyon", name: "Lyon", nameAr: "ليون", country: "France", countryCode: "FR", latitude: 45.7640, longitude: 4.8357, tier: 3 },
  { id: "berlin", name: "Berlin", nameAr: "برلين", country: "Germany", countryCode: "DE", latitude: 52.5200, longitude: 13.4050, tier: 1 },
  { id: "munich", name: "Munich", nameAr: "ميونخ", country: "Germany", countryCode: "DE", latitude: 48.1351, longitude: 11.5820, tier: 2 },
  { id: "frankfurt", name: "Frankfurt", nameAr: "فرانكفورت", country: "Germany", countryCode: "DE", latitude: 50.1109, longitude: 8.6821, tier: 2 },
  { id: "hamburg", name: "Hamburg", nameAr: "هامبورغ", country: "Germany", countryCode: "DE", latitude: 53.5511, longitude: 9.9937, tier: 3 },
  { id: "madrid", name: "Madrid", nameAr: "مدريد", country: "Spain", countryCode: "ES", latitude: 40.4168, longitude: -3.7038, tier: 1 },
  { id: "barcelona", name: "Barcelona", nameAr: "برشلونة", country: "Spain", countryCode: "ES", latitude: 41.3851, longitude: 2.1734, tier: 2 },
  { id: "seville", name: "Seville", nameAr: "إشبيلية", country: "Spain", countryCode: "ES", latitude: 37.3891, longitude: -5.9845, tier: 3 },
  { id: "rome", name: "Rome", nameAr: "روما", country: "Italy", countryCode: "IT", latitude: 41.9028, longitude: 12.4964, tier: 1 },
  { id: "milan", name: "Milan", nameAr: "ميلانو", country: "Italy", countryCode: "IT", latitude: 45.4642, longitude: 9.1900, tier: 2 },
  { id: "venice", name: "Venice", nameAr: "البندقية", country: "Italy", countryCode: "IT", latitude: 45.4408, longitude: 12.3155, tier: 3 },
  { id: "amsterdam", name: "Amsterdam", nameAr: "أمستردام", country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041, tier: 2 },
  { id: "brussels", name: "Brussels", nameAr: "بروكسل", country: "Belgium", countryCode: "BE", latitude: 50.8503, longitude: 4.3517, tier: 2 },
  { id: "vienna", name: "Vienna", nameAr: "فيينا", country: "Austria", countryCode: "AT", latitude: 48.2082, longitude: 16.3738, tier: 2 },
  { id: "zurich", name: "Zurich", nameAr: "زيورخ", country: "Switzerland", countryCode: "CH", latitude: 47.3769, longitude: 8.5417, tier: 2 },
  { id: "geneva", name: "Geneva", nameAr: "جنيف", country: "Switzerland", countryCode: "CH", latitude: 46.2044, longitude: 6.1432, tier: 3 },
  { id: "lisbon", name: "Lisbon", nameAr: "لشبونة", country: "Portugal", countryCode: "PT", latitude: 38.7223, longitude: -9.1393, tier: 2 },
  { id: "dublin", name: "Dublin", nameAr: "دبلن", country: "Ireland", countryCode: "IE", latitude: 53.3498, longitude: -6.2603, tier: 2 },
  { id: "copenhagen", name: "Copenhagen", nameAr: "كوبنهاغن", country: "Denmark", countryCode: "DK", latitude: 55.6761, longitude: 12.5683, tier: 2 },
  { id: "stockholm", name: "Stockholm", nameAr: "ستوكهولم", country: "Sweden", countryCode: "SE", latitude: 59.3293, longitude: 18.0686, tier: 2 },
  { id: "oslo", name: "Oslo", nameAr: "أوسلو", country: "Norway", countryCode: "NO", latitude: 59.9139, longitude: 10.7522, tier: 2 },
  { id: "helsinki", name: "Helsinki", nameAr: "هلسنكي", country: "Finland", countryCode: "FI", latitude: 60.1699, longitude: 24.9384, tier: 2 },
  { id: "warsaw", name: "Warsaw", nameAr: "وارسو", country: "Poland", countryCode: "PL", latitude: 52.2297, longitude: 21.0122, tier: 2 },
  { id: "prague", name: "Prague", nameAr: "براغ", country: "Czech Republic", countryCode: "CZ", latitude: 50.0755, longitude: 14.4378, tier: 2 },
  { id: "budapest", name: "Budapest", nameAr: "بودابست", country: "Hungary", countryCode: "HU", latitude: 47.4979, longitude: 19.0402, tier: 2 },
  { id: "athens", name: "Athens", nameAr: "أثينا", country: "Greece", countryCode: "GR", latitude: 37.9838, longitude: 23.7275, tier: 2 },
  { id: "istanbul", name: "Istanbul", nameAr: "إسطنبول", country: "Turkey", countryCode: "TR", latitude: 41.0082, longitude: 28.9784, tier: 1 },
  { id: "ankara", name: "Ankara", nameAr: "أنقرة", country: "Turkey", countryCode: "TR", latitude: 39.9334, longitude: 32.8597, tier: 2 },
  { id: "moscow", name: "Moscow", nameAr: "موسكو", country: "Russia", countryCode: "RU", latitude: 55.7558, longitude: 37.6173, tier: 1 },
  { id: "saint-petersburg", name: "Saint Petersburg", nameAr: "سانت بطرسبرغ", country: "Russia", countryCode: "RU", latitude: 59.9311, longitude: 30.3609, tier: 2 },
  { id: "kyiv", name: "Kyiv", nameAr: "كييف", country: "Ukraine", countryCode: "UA", latitude: 50.4501, longitude: 30.5234, tier: 2 },
  { id: "bucharest", name: "Bucharest", nameAr: "بوخارست", country: "Romania", countryCode: "RO", latitude: 44.4268, longitude: 26.1025, tier: 3 },

  // ── Asia & Pacific ───────────────────────────────────────────
  { id: "tokyo", name: "Tokyo", nameAr: "طوكيو", country: "Japan", countryCode: "JP", latitude: 35.6762, longitude: 139.6503, tier: 1 },
  { id: "osaka", name: "Osaka", nameAr: "أوساكا", country: "Japan", countryCode: "JP", latitude: 34.6937, longitude: 135.5023, tier: 2 },
  { id: "kyoto", name: "Kyoto", nameAr: "كيوتو", country: "Japan", countryCode: "JP", latitude: 35.0116, longitude: 135.7681, tier: 3 },
  { id: "seoul", name: "Seoul", nameAr: "سيول", country: "South Korea", countryCode: "KR", latitude: 37.5665, longitude: 126.9780, tier: 1 },
  { id: "busan", name: "Busan", nameAr: "بوسان", country: "South Korea", countryCode: "KR", latitude: 35.1796, longitude: 129.0756, tier: 3 },
  { id: "beijing", name: "Beijing", nameAr: "بكين", country: "China", countryCode: "CN", latitude: 39.9042, longitude: 116.4074, tier: 1 },
  { id: "shanghai", name: "Shanghai", nameAr: "شنغهاي", country: "China", countryCode: "CN", latitude: 31.2304, longitude: 121.4737, tier: 1 },
  { id: "guangzhou", name: "Guangzhou", nameAr: "غوانزو", country: "China", countryCode: "CN", latitude: 23.1291, longitude: 113.2644, tier: 2 },
  { id: "shenzhen", name: "Shenzhen", nameAr: "شينزين", country: "China", countryCode: "CN", latitude: 22.5431, longitude: 114.0579, tier: 2 },
  { id: "hong-kong", name: "Hong Kong", nameAr: "هونغ كونغ", country: "Hong Kong", countryCode: "HK", latitude: 22.3193, longitude: 114.1694, tier: 1 },
  { id: "taipei", name: "Taipei", nameAr: "تايبيه", country: "Taiwan", countryCode: "TW", latitude: 25.0330, longitude: 121.5654, tier: 2 },
  { id: "singapore", name: "Singapore", nameAr: "سنغافورة", country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198, tier: 1 },
  { id: "kuala-lumpur", name: "Kuala Lumpur", nameAr: "كوالالمبور", country: "Malaysia", countryCode: "MY", latitude: 3.1390, longitude: 101.6869, tier: 2 },
  { id: "bangkok", name: "Bangkok", nameAr: "بانكوك", country: "Thailand", countryCode: "TH", latitude: 13.7563, longitude: 100.5018, tier: 1 },
  { id: "jakarta", name: "Jakarta", nameAr: "جاكرتا", country: "Indonesia", countryCode: "ID", latitude: -6.2088, longitude: 106.8456, tier: 1 },
  { id: "bali", name: "Denpasar (Bali)", nameAr: "بالي", country: "Indonesia", countryCode: "ID", latitude: -8.6705, longitude: 115.2126, tier: 3 },
  { id: "manila", name: "Manila", nameAr: "مانيلا", country: "Philippines", countryCode: "PH", latitude: 14.5995, longitude: 120.9842, tier: 2 },
  { id: "hanoi", name: "Hanoi", nameAr: "هانوي", country: "Vietnam", countryCode: "VN", latitude: 21.0285, longitude: 105.8542, tier: 2 },
  { id: "ho-chi-minh", name: "Ho Chi Minh City", nameAr: "هو تشي منه", country: "Vietnam", countryCode: "VN", latitude: 10.8231, longitude: 106.6297, tier: 2 },
  { id: "mumbai", name: "Mumbai", nameAr: "مومباي", country: "India", countryCode: "IN", latitude: 19.0760, longitude: 72.8777, tier: 1 },
  { id: "delhi", name: "New Delhi", nameAr: "نيودلهي", country: "India", countryCode: "IN", latitude: 28.6139, longitude: 77.2090, tier: 1 },
  { id: "bangalore", name: "Bangalore", nameAr: "بنغالور", country: "India", countryCode: "IN", latitude: 12.9716, longitude: 77.5946, tier: 2 },
  { id: "kolkata", name: "Kolkata", nameAr: "كولكاتا", country: "India", countryCode: "IN", latitude: 22.5726, longitude: 88.3639, tier: 2 },
  { id: "karachi", name: "Karachi", nameAr: "كراتشي", country: "Pakistan", countryCode: "PK", latitude: 24.8607, longitude: 67.0011, tier: 1 },
  { id: "lahore", name: "Lahore", nameAr: "لاهور", country: "Pakistan", countryCode: "PK", latitude: 31.5204, longitude: 74.3587, tier: 2 },
  { id: "islamabad", name: "Islamabad", nameAr: "إسلام أباد", country: "Pakistan", countryCode: "PK", latitude: 33.6844, longitude: 73.0479, tier: 2 },
  { id: "dhaka", name: "Dhaka", nameAr: "دكا", country: "Bangladesh", countryCode: "BD", latitude: 23.8103, longitude: 90.4125, tier: 1 },
  { id: "tehran", name: "Tehran", nameAr: "طهران", country: "Iran", countryCode: "IR", latitude: 35.6892, longitude: 51.3890, tier: 1 },
  { id: "isfahan", name: "Isfahan", nameAr: "أصفهان", country: "Iran", countryCode: "IR", latitude: 32.6546, longitude: 51.6680, tier: 3 },
  { id: "tashkent", name: "Tashkent", nameAr: "طشقند", country: "Uzbekistan", countryCode: "UZ", latitude: 41.2995, longitude: 69.2401, tier: 2 },
  { id: "astana", name: "Astana", nameAr: "أستانا", country: "Kazakhstan", countryCode: "KZ", latitude: 51.1694, longitude: 71.4491, tier: 2 },
  { id: "almaty", name: "Almaty", nameAr: "ألماتي", country: "Kazakhstan", countryCode: "KZ", latitude: 43.2220, longitude: 76.8512, tier: 3 },

  // ── North America ────────────────────────────────────────────
  { id: "new-york", name: "New York", nameAr: "نيويورك", country: "United States", countryCode: "US", latitude: 40.7128, longitude: -74.0060, tier: 1 },
  { id: "los-angeles", name: "Los Angeles", nameAr: "لوس أنجلوس", country: "United States", countryCode: "US", latitude: 34.0522, longitude: -118.2437, tier: 1 },
  { id: "chicago", name: "Chicago", nameAr: "شيكاغو", country: "United States", countryCode: "US", latitude: 41.8781, longitude: -87.6298, tier: 1 },
  { id: "houston", name: "Houston", nameAr: "هيوسن", country: "United States", countryCode: "US", latitude: 29.7604, longitude: -95.3698, tier: 2 },
  { id: "miami", name: "Miami", nameAr: "ميامي", country: "United States", countryCode: "US", latitude: 25.7617, longitude: -80.1918, tier: 2 },
  { id: "san-francisco", name: "San Francisco", nameAr: "سان فرانسيسكو", country: "United States", countryCode: "US", latitude: 37.7749, longitude: -122.4194, tier: 2 },
  { id: "washington", name: "Washington D.C.", nameAr: "واشنطن", country: "United States", countryCode: "US", latitude: 38.9072, longitude: -77.0369, tier: 2 },
  { id: "seattle", name: "Seattle", nameAr: "سياتل", country: "United States", countryCode: "US", latitude: 47.6062, longitude: -122.3321, tier: 2 },
  { id: "boston", name: "Boston", nameAr: "بوسطن", country: "United States", countryCode: "US", latitude: 42.3601, longitude: -71.0589, tier: 3 },
  { id: "dallas", name: "Dallas", nameAr: "دالاس", country: "United States", countryCode: "US", latitude: 32.7767, longitude: -96.7970, tier: 3 },
  { id: "toronto", name: "Toronto", nameAr: "تورونتو", country: "Canada", countryCode: "CA", latitude: 43.6532, longitude: -79.3832, tier: 1 },
  { id: "montreal", name: "Montreal", nameAr: "مونتريال", country: "Canada", countryCode: "CA", latitude: 45.5017, longitude: -73.5673, tier: 2 },
  { id: "vancouver", name: "Vancouver", nameAr: "فانكوفر", country: "Canada", countryCode: "CA", latitude: 49.2827, longitude: -123.1207, tier: 2 },
  { id: "calgary", name: "Calgary", nameAr: "كالغاري", country: "Canada", countryCode: "CA", latitude: 51.0447, longitude: -114.0719, tier: 3 },
  { id: "mexico-city", name: "Mexico City", nameAr: "مكسيكو سيتي", country: "Mexico", countryCode: "MX", latitude: 19.4326, longitude: -99.1332, tier: 1 },
  { id: "guadalajara", name: "Guadalajara", nameAr: "غوادالاخارا", country: "Mexico", countryCode: "MX", latitude: 20.6597, longitude: -103.3496, tier: 3 },
  { id: "cancun", name: "Cancun", nameAr: "كانكون", country: "Mexico", countryCode: "MX", latitude: 21.1619, longitude: -86.8515, tier: 3 },

  // ── South America ────────────────────────────────────────────
  { id: "sao-paulo", name: "São Paulo", nameAr: "ساو باولو", country: "Brazil", countryCode: "BR", latitude: -23.5505, longitude: -46.6333, tier: 1 },
  { id: "rio-de-janeiro", name: "Rio de Janeiro", nameAr: "ريو دي جانيرو", country: "Brazil", countryCode: "BR", latitude: -22.9068, longitude: -43.1729, tier: 1 },
  { id: "brasilia", name: "Brasília", nameAr: "برازيليا", country: "Brazil", countryCode: "BR", latitude: -15.8267, longitude: -47.9218, tier: 2 },
  { id: "buenos-aires", name: "Buenos Aires", nameAr: "بوينس آيرس", country: "Argentina", countryCode: "AR", latitude: -34.6037, longitude: -58.3816, tier: 1 },
  { id: "cordoba", name: "Córdoba", nameAr: "قرطبة (الأرجنتين)", country: "Argentina", countryCode: "AR", latitude: -31.4201, longitude: -64.1888, tier: 3 },
  { id: "bogota", name: "Bogotá", nameAr: "بوغوتا", country: "Colombia", countryCode: "CO", latitude: 4.7110, longitude: -74.0721, tier: 1 },
  { id: "medellin", name: "Medellín", nameAr: "ميديلين", country: "Colombia", countryCode: "CO", latitude: 6.2442, longitude: -75.5812, tier: 3 },
  { id: "lima", name: "Lima", nameAr: "ليما", country: "Peru", countryCode: "PE", latitude: -12.0464, longitude: -77.0428, tier: 1 },
  { id: "santiago", name: "Santiago", nameAr: "سانتياغو", country: "Chile", countryCode: "CL", latitude: -33.4489, longitude: -70.6693, tier: 1 },
  { id: "caracas", name: "Caracas", nameAr: "كاراكاس", country: "Venezuela", countryCode: "VE", latitude: 10.4806, longitude: -66.9036, tier: 2 },
  { id: "quito", name: "Quito", nameAr: "كيتو", country: "Ecuador", countryCode: "EC", latitude: -0.1807, longitude: -78.4678, tier: 2 },
  { id: "montevideo", name: "Montevideo", nameAr: "مونتيفيديو", country: "Uruguay", countryCode: "UY", latitude: -34.9011, longitude: -56.1645, tier: 2 },

  // ── Africa ───────────────────────────────────────────────────
  { id: "lagos", name: "Lagos", nameAr: "لاغوس", country: "Nigeria", countryCode: "NG", latitude: 6.5244, longitude: 3.3792, tier: 1 },
  { id: "abuja", name: "Abuja", nameAr: "أبوجا", country: "Nigeria", countryCode: "NG", latitude: 9.0765, longitude: 7.3986, tier: 2 },
  { id: "nairobi", name: "Nairobi", nameAr: "نيروبي", country: "Kenya", countryCode: "KE", latitude: -1.2921, longitude: 36.8219, tier: 1 },
  { id: "mombasa", name: "Mombasa", nameAr: "مومباسا", country: "Kenya", countryCode: "KE", latitude: -4.0435, longitude: 39.6682, tier: 3 },
  { id: "addis-ababa", name: "Addis Ababa", nameAr: "أديس أبابا", country: "Ethiopia", countryCode: "ET", latitude: 9.0320, longitude: 38.7469, tier: 1 },
  { id: "johannesburg", name: "Johannesburg", nameAr: "جوهانسبرغ", country: "South Africa", countryCode: "ZA", latitude: -26.2041, longitude: 28.0473, tier: 1 },
  { id: "cape-town", name: "Cape Town", nameAr: "كيب تاون", country: "South Africa", countryCode: "ZA", latitude: -33.9249, longitude: 18.4241, tier: 1 },
  { id: "durban", name: "Durban", nameAr: "ديربان", country: "South Africa", countryCode: "ZA", latitude: -29.8587, longitude: 31.0218, tier: 3 },
  { id: "accra", name: "Accra", nameAr: "أكرا", country: "Ghana", countryCode: "GH", latitude: 5.6037, longitude: -0.1870, tier: 2 },
  { id: "dakar", name: "Dakar", nameAr: "داكار", country: "Senegal", countryCode: "SN", latitude: 14.7167, longitude: -17.4677, tier: 2 },
  { id: "dar-es-salaam", name: "Dar es Salaam", nameAr: "دار السلام", country: "Tanzania", countryCode: "TZ", latitude: -6.7924, longitude: 39.2083, tier: 2 },
  { id: "kampala", name: "Kampala", nameAr: "كمبالا", country: "Uganda", countryCode: "UG", latitude: 0.3476, longitude: 32.5825, tier: 2 },
  { id: "kinshasa", name: "Kinshasa", nameAr: "كينشاسا", country: "Democratic Republic of the Congo", countryCode: "CD", latitude: -4.4419, longitude: 15.2663, tier: 1 },
  { id: "luanda", name: "Luanda", nameAr: "لواندا", country: "Angola", countryCode: "AO", latitude: -8.8390, longitude: 13.2894, tier: 2 },
  { id: "abidjan", name: "Abidjan", nameAr: "أبيدجان", country: "Ivory Coast", countryCode: "CI", latitude: 5.3600, longitude: -4.0083, tier: 2 },

  // ── Oceania ──────────────────────────────────────────────────
  { id: "sydney", name: "Sydney", nameAr: "سيدني", country: "Australia", countryCode: "AU", latitude: -33.8688, longitude: 151.2093, tier: 1 },
  { id: "melbourne", name: "Melbourne", nameAr: "ملبورن", country: "Australia", countryCode: "AU", latitude: -37.8136, longitude: 144.9631, tier: 1 },
  { id: "brisbane", name: "Brisbane", nameAr: "بريزبان", country: "Australia", countryCode: "AU", latitude: -27.4698, longitude: 153.0251, tier: 2 },
  { id: "perth", name: "Perth", nameAr: "بيرث", country: "Australia", countryCode: "AU", latitude: -31.9505, longitude: 115.8605, tier: 2 },
  { id: "adelaide", name: "Adelaide", nameAr: "أديلايد", country: "Australia", countryCode: "AU", latitude: -34.9285, longitude: 138.6007, tier: 3 },
  { id: "auckland", name: "Auckland", nameAr: "أوكلاند", country: "New Zealand", countryCode: "NZ", latitude: -36.8485, longitude: 174.7633, tier: 2 },
  { id: "wellington", name: "Wellington", nameAr: "ويلينغتون", country: "New Zealand", countryCode: "NZ", latitude: -41.2865, longitude: 174.7762, tier: 3 },
];

/**
 * Filter world cities based on the current Leaflet zoom level.
 * Prevents map clutter while ensuring all cities are accessible when zooming in.
 */
export function getWorldCitiesForZoom(zoom) {
  if (zoom <= 2) {
    return WORLD_CITIES.filter((c) => c.tier === 1);
  }
  if (zoom <= 4) {
    return WORLD_CITIES.filter((c) => c.tier <= 2);
  }
  return WORLD_CITIES;
}

/**
 * Quick client-side search across world cities in Arabic and English.
 */
export function searchPreloadedCities(query) {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  return WORLD_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.nameAr.includes(q) ||
      c.country.toLowerCase().includes(q)
  );
}
