-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-10-2025 a las 23:16:36
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `levelup-life`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `achievements`
--

CREATE TABLE `achievements` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `requirement_type` varchar(50) NOT NULL,
  `requirement_value` int(11) NOT NULL,
  `rarity` enum('common','rare','epic','legendary') DEFAULT 'common'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `achievements`
--

INSERT INTO `achievements` (`id`, `name`, `description`, `icon`, `category`, `requirement_type`, `requirement_value`, `rarity`) VALUES
(1, 'Primer Paso', 'Completa tu primer hábito', 'star', 'Especiales', 'first_habit', 1, 'common'),
(2, 'Hidratado', 'Toma agua 7 días seguidos', 'droplet', 'Nutrición', 'habit_streak_2_7', 7, 'common'),
(3, 'Guerrero del Cardio', 'Haz cardio 30 días seguidos', 'activity', 'Ejercicio', 'habit_streak_1_30', 30, 'rare'),
(4, 'Fuerza Mental', 'Medita 21 días seguidos', 'brain', 'Bienestar', 'habit_streak_12_21', 21, 'rare'),
(5, 'Atleta Completo', 'Completa hábitos de todas las categorías por 14 días', 'trophy', 'Especiales', 'all_categories_14', 14, 'epic'),
(6, 'Racha de Fuego', 'Alcanza 7 días de racha', 'flame', 'Especiales', 'streak', 7, 'common'),
(7, 'Racha Imparable', 'Alcanza 30 días de racha', 'zap', 'Especiales', 'streak', 30, 'rare'),
(8, 'Centenario', 'Alcanza 100 días de racha', 'award', 'Especiales', 'streak', 100, 'epic'),
(9, 'Perfeccionista', 'Completa todos tus hábitos activos en un día', 'check-check', 'Especiales', 'perfect_day', 1, 'rare'),
(10, 'Maratonista', 'Completa 100 hábitos en total', 'flag', 'Especiales', 'total_habits', 100, 'rare'),
(11, 'Dedicado', 'Completa 500 hábitos en total', 'target', 'Especiales', 'total_habits', 500, 'epic'),
(12, 'Leyenda', 'Alcanza nivel 50', 'crown', 'Especiales', 'level', 50, 'legendary'),
(13, 'Élite', 'Alcanza nivel 25', 'gem', 'Especiales', 'level', 25, 'epic'),
(14, 'Avanzado', 'Alcanza nivel 10', 'trending-up', 'Especiales', 'level', 10, 'rare');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favorite_recipes`
--

CREATE TABLE `favorite_recipes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `foods`
--

CREATE TABLE `foods` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `category` enum('protein','carbs','vegetables','fruits','dairy','fats','grains') DEFAULT NULL,
  `calories` int(11) NOT NULL,
  `protein` decimal(5,2) DEFAULT NULL,
  `carbs` decimal(5,2) DEFAULT NULL,
  `fat` decimal(5,2) DEFAULT NULL,
  `fiber` decimal(5,2) DEFAULT NULL,
  `serving_size` varchar(50) DEFAULT NULL,
  `is_vegetarian` tinyint(1) DEFAULT 1,
  `is_vegan` tinyint(1) DEFAULT 0,
  `is_gluten_free` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `foods`
--

INSERT INTO `foods` (`id`, `name`, `category`, `calories`, `protein`, `carbs`, `fat`, `fiber`, `serving_size`, `is_vegetarian`, `is_vegan`, `is_gluten_free`) VALUES
(1, 'Pechuga de pollo', 'protein', 165, 31.00, 0.00, 3.60, 0.00, '100g', 0, 0, 1),
(2, 'Huevos', 'protein', 155, 13.00, 1.10, 11.00, 0.00, '2 huevos', 0, 0, 1),
(3, 'Salmón', 'protein', 208, 20.00, 0.00, 13.00, 0.00, '100g', 0, 0, 1),
(4, 'Atún', 'protein', 132, 28.00, 0.00, 1.30, 0.00, '100g', 0, 0, 1),
(5, 'Tofu', 'protein', 76, 8.00, 1.90, 4.80, 0.30, '100g', 1, 1, 1),
(6, 'Lentejas', 'protein', 116, 9.00, 20.00, 0.40, 8.00, '100g cocidas', 1, 1, 1),
(7, 'Garbanzos', 'protein', 164, 9.00, 27.00, 2.60, 7.60, '100g cocidos', 1, 1, 1),
(8, 'Arroz integral', 'grains', 111, 2.60, 23.00, 0.90, 1.80, '100g cocido', 1, 1, 1),
(9, 'Avena', 'grains', 389, 16.90, 66.00, 6.90, 10.60, '100g', 1, 1, 0),
(10, 'Quinoa', 'grains', 120, 4.40, 21.00, 1.90, 2.80, '100g cocida', 1, 1, 1),
(11, 'Batata', 'carbs', 86, 1.60, 20.00, 0.10, 3.00, '100g', 1, 1, 1),
(12, 'Pan integral', 'grains', 247, 13.00, 41.00, 3.40, 7.00, '100g', 1, 0, 0),
(13, 'Pasta integral', 'grains', 124, 5.00, 26.00, 0.50, 3.50, '100g cocida', 1, 1, 0),
(14, 'Brócoli', 'vegetables', 34, 2.80, 7.00, 0.40, 2.60, '100g', 1, 1, 1),
(15, 'Espinacas', 'vegetables', 23, 2.90, 3.60, 0.40, 2.20, '100g', 1, 1, 1),
(16, 'Zanahoria', 'vegetables', 41, 0.90, 10.00, 0.20, 2.80, '100g', 1, 1, 1),
(17, 'Tomate', 'vegetables', 18, 0.90, 3.90, 0.20, 1.20, '100g', 1, 1, 1),
(18, 'Lechuga', 'vegetables', 15, 1.40, 2.90, 0.20, 1.30, '100g', 1, 1, 1),
(19, 'Pepino', 'vegetables', 16, 0.70, 3.60, 0.10, 0.50, '100g', 1, 1, 1),
(20, 'Pimiento', 'vegetables', 31, 1.00, 6.00, 0.30, 2.10, '100g', 1, 1, 1),
(21, 'Plátano', 'fruits', 89, 1.10, 23.00, 0.30, 2.60, '1 mediano', 1, 1, 1),
(22, 'Manzana', 'fruits', 52, 0.30, 14.00, 0.20, 2.40, '1 mediana', 1, 1, 1),
(23, 'Fresas', 'fruits', 32, 0.70, 7.70, 0.30, 2.00, '100g', 1, 1, 1),
(24, 'Aguacate', 'fruits', 160, 2.00, 8.50, 15.00, 7.00, '100g', 1, 1, 1),
(25, 'Naranja', 'fruits', 47, 0.90, 12.00, 0.10, 2.40, '1 mediana', 1, 1, 1),
(26, 'Aceite de oliva', 'fats', 884, 0.00, 0.00, 100.00, 0.00, '100ml', 1, 1, 1),
(27, 'Almendras', 'fats', 579, 21.00, 22.00, 49.00, 12.00, '100g', 1, 1, 1),
(28, 'Nueces', 'fats', 654, 15.00, 14.00, 65.00, 7.00, '100g', 1, 1, 1),
(29, 'Mantequilla de maní', 'fats', 588, 25.00, 20.00, 50.00, 6.00, '100g', 1, 1, 1),
(30, 'Yogurt griego', 'dairy', 59, 10.00, 3.60, 0.40, 0.00, '100g', 1, 0, 1),
(31, 'Leche descremada', 'dairy', 34, 3.40, 5.00, 0.10, 0.00, '100ml', 1, 0, 1),
(32, 'Queso cottage', 'dairy', 98, 11.00, 3.40, 4.30, 0.00, '100g', 1, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habits`
--

CREATE TABLE `habits` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `points_value` int(11) DEFAULT 10,
  `estimated_calories` int(11) DEFAULT 0,
  `duration_minutes` int(11) DEFAULT 0,
  `frequency` enum('daily','weekly') DEFAULT 'daily',
  `icon` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habits`
--

INSERT INTO `habits` (`id`, `category_id`, `name`, `description`, `points_value`, `estimated_calories`, `duration_minutes`, `frequency`, `icon`) VALUES
(1, 1, 'Cardio 30 min', 'Hacer 30 minutos de ejercicio cardiovascular', 25, 250, 30, 'daily', 'activity'),
(2, 1, 'Entrenamiento de fuerza', 'Entrenamiento de fuerza 45 minutos', 30, 200, 45, 'daily', 'dumbbell'),
(3, 1, 'Caminar 10,000 pasos', 'Caminar al menos 10,000 pasos en el día', 20, 400, 0, 'daily', 'footprints'),
(4, 1, 'Yoga/Pilates 30 min', 'Sesión de yoga o pilates', 20, 120, 30, 'daily', 'stretch-horizontal'),
(5, 1, 'Correr 5km', 'Correr 5 kilómetros', 35, 350, 0, 'daily', 'run'),
(6, 1, 'Nadar 30 min', 'Nadar durante 30 minutos', 30, 300, 30, 'daily', 'waves'),
(7, 1, 'Bicicleta 1 hora', 'Andar en bicicleta 1 hora', 30, 400, 60, 'daily', 'bike'),
(8, 2, 'Tomar 8 vasos de agua', 'Beber al menos 8 vasos de agua al día', 10, 0, 0, 'daily', 'droplet'),
(9, 2, '5 porciones frutas/verduras', 'Consumir 5 porciones de frutas y verduras', 15, 0, 0, 'daily', 'apple'),
(10, 2, 'Desayuno saludable', 'Tomar un desayuno nutritivo y balanceado', 10, 0, 0, 'daily', 'sunrise'),
(11, 2, 'Evitar comida chatarra', 'No consumir comida procesada o chatarra', 15, 0, 0, 'daily', 'ban'),
(12, 2, 'Comida casera', 'Comer comida preparada en casa (no delivery)', 10, 0, 0, 'daily', 'chef-hat'),
(13, 3, 'Dormir 7-8 horas', 'Dormir entre 7 y 8 horas', 15, 0, 0, 'daily', 'moon'),
(14, 3, 'Meditar 10 minutos', 'Sesión de meditación o mindfulness', 10, 0, 10, 'daily', 'brain'),
(15, 3, 'Estiramientos 15 min', 'Hacer estiramientos o movilidad', 10, 0, 15, 'daily', 'stretch-horizontal'),
(16, 3, 'Descansos activos', 'Tomar pausas activas durante el día', 5, 0, 0, 'daily', 'coffee'),
(17, 3, 'No pantallas antes de dormir', 'No usar pantallas 1 hora antes de dormir', 10, 0, 0, 'daily', 'smartphone');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habit_categories`
--

CREATE TABLE `habit_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habit_categories`
--

INSERT INTO `habit_categories` (`id`, `name`, `icon`, `color`) VALUES
(1, 'Ejercicio', 'dumbbell', '#f97316'),
(2, 'Nutrición', 'apple', '#0ea5e9'),
(3, 'Bienestar', 'heart', '#a855f7');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habit_completions`
--

CREATE TABLE `habit_completions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `habit_id` int(11) NOT NULL,
  `completed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `points_earned` int(11) NOT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recipes`
--

CREATE TABLE `recipes` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `meal_type` enum('breakfast','lunch','dinner','snack') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ingredients` text NOT NULL,
  `instructions` text DEFAULT NULL,
  `prep_time_minutes` int(11) DEFAULT NULL,
  `total_calories` int(11) DEFAULT NULL,
  `protein` int(11) DEFAULT NULL,
  `carbs` int(11) DEFAULT NULL,
  `fat` int(11) DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') DEFAULT 'easy',
  `is_vegetarian` tinyint(1) DEFAULT 0,
  `is_vegan` tinyint(1) DEFAULT 0,
  `is_gluten_free` tinyint(1) DEFAULT 0,
  `tags` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recipes`
--

INSERT INTO `recipes` (`id`, `name`, `meal_type`, `description`, `ingredients`, `instructions`, `prep_time_minutes`, `total_calories`, `protein`, `carbs`, `fat`, `difficulty`, `is_vegetarian`, `is_vegan`, `is_gluten_free`, `tags`) VALUES
(1, 'Avena con frutas', 'breakfast', 'Desayuno energético con avena, plátano y fresas', '[\"50g avena\", \"1 plátano\", \"100g fresas\", \"1 cucharada almendras\", \"200ml leche\"]', '1. Cocina la avena con leche durante 5 minutos. 2. Agrega plátano en rodajas y fresas. 3. Decora con almendras picadas.', 10, 450, 15, 68, 10, 'easy', 1, 0, 0, '[\"high-fiber\", \"energizing\", \"quick\"]'),
(2, 'Huevos revueltos con tostadas', 'breakfast', 'Clásico desayuno proteico', '[\"3 huevos\", \"2 rebanadas pan integral\", \"1 cucharadita aceite de oliva\", \"sal y pimienta\"]', '1. Bate los huevos con sal y pimienta. 2. Cocina en sartén con aceite. 3. Tuesta el pan integral. 4. Sirve juntos.', 10, 420, 26, 42, 16, 'easy', 1, 0, 0, '[\"high-protein\", \"quick\", \"classic\"]'),
(3, 'Smoothie proteico', 'breakfast', 'Batido nutritivo perfecto post-entrenamiento', '[\"1 plátano\", \"30g avena\", \"200ml leche\", \"100g fresas\", \"1 cucharada mantequilla de maní\"]', '1. Coloca todos los ingredientes en la licuadora. 2. Licúa hasta obtener consistencia suave. 3. Sirve inmediatamente.', 5, 420, 16, 58, 12, 'easy', 1, 0, 0, '[\"post-workout\", \"quick\", \"energizing\"]'),
(4, 'Yogurt con granola', 'breakfast', 'Desayuno ligero y nutritivo', '[\"200g yogurt griego\", \"50g granola\", \"1 plátano\", \"1 cucharada miel\"]', '1. Sirve el yogurt en un bowl. 2. Añade granola y plátano en rodajas. 3. Decora con miel.', 5, 380, 18, 56, 8, 'easy', 1, 0, 0, '[\"light\", \"quick\", \"no-cook\"]'),
(5, 'Tostadas de aguacate', 'breakfast', 'Desayuno trendy y saludable', '[\"2 rebanadas pan integral\", \"1 aguacate\", \"1 huevo pochado\", \"tomate cherry\", \"sal y pimienta\"]', '1. Tuesta el pan. 2. Machaca el aguacate con sal y pimienta. 3. Unta en el pan. 4. Añade huevo pochado y tomates.', 15, 420, 18, 42, 22, 'medium', 1, 0, 0, '[\"trendy\", \"healthy-fats\", \"filling\"]'),
(6, 'Pollo con arroz y brócoli', 'lunch', 'Comida balanceada alta en proteína', '[\"200g pechuga de pollo\", \"150g arroz integral cocido\", \"200g brócoli\", \"1 cucharada aceite de oliva\", \"especias\"]', '1. Cocina el pollo a la plancha con especias. 2. Cocina el brócoli al vapor. 3. Calienta el arroz. 4. Sirve todo junto.', 25, 550, 52, 58, 12, 'easy', 0, 0, 0, '[\"high-protein\", \"balanced\", \"meal-prep\"]'),
(7, 'Ensalada de salmón', 'lunch', 'Ensalada completa rica en omega-3', '[\"180g salmón\", \"100g lechuga mixta\", \"50g tomate\", \"1/2 aguacate\", \"pepino\", \"aceite de oliva y limón\"]', '1. Cocina el salmón al horno o plancha. 2. Prepara la ensalada con todos los vegetales. 3. Coloca el salmón encima. 4. Adereza con aceite y limón.', 20, 520, 38, 18, 34, 'medium', 0, 0, 0, '[\"omega-3\", \"low-carb\", \"healthy-fats\"]'),
(8, 'Bowl de quinoa vegetariano', 'lunch', 'Bowl completo con proteína vegetal', '[\"150g quinoa cocida\", \"150g tofu\", \"100g espinacas\", \"50g zanahoria\", \"1/2 aguacate\", \"salsa de soya\"]', '1. Cocina el tofu en cubos dorados. 2. Saltea las espinacas. 3. Ralla la zanahoria. 4. Arma el bowl con quinoa de base y todos los ingredientes. 5. Adereza con salsa de soya.', 20, 480, 24, 52, 20, 'easy', 1, 1, 0, '[\"plant-based\", \"complete-meal\", \"vegan\"]'),
(9, 'Pasta con atún', 'lunch', 'Pasta rápida y nutritiva', '[\"120g pasta integral\", \"1 lata atún\", \"200g tomate\", \"50g espinacas\", \"ajo\", \"aceite de oliva\"]', '1. Cocina la pasta según instrucciones. 2. Saltea ajo, tomate y espinacas. 3. Añade el atún escurrido. 4. Mezcla con la pasta.', 20, 520, 38, 64, 12, 'easy', 0, 0, 0, '[\"quick\", \"high-protein\", \"mediterranean\"]'),
(10, 'Tacos de pollo saludables', 'lunch', 'Tacos proteicos con vegetales', '[\"150g pechuga de pollo\", \"3 tortillas integrales\", \"lechuga\", \"tomate\", \"1/4 aguacate\", \"salsa\"]', '1. Cocina y desmenuza el pollo con especias. 2. Calienta las tortillas. 3. Arma los tacos con pollo, lechuga, tomate y aguacate.', 20, 480, 42, 48, 14, 'easy', 0, 0, 0, '[\"mexican\", \"high-protein\", \"fun\"]'),
(11, 'Pechuga con vegetales asados', 'dinner', 'Cena ligera y completa', '[\"150g pechuga de pollo\", \"150g calabacín\", \"100g berenjena\", \"100g pimiento\", \"aceite de oliva\", \"hierbas\"]', '1. Corta todos los vegetales en trozos. 2. Asa en el horno con aceite y hierbas a 200°C por 25 min. 3. Cocina el pollo a la plancha. 4. Sirve junto.', 30, 380, 42, 24, 14, 'easy', 0, 0, 0, '[\"light-dinner\", \"low-carb\", \"colorful\"]'),
(12, 'Pescado al horno con ensalada', 'dinner', 'Cena ligera rica en proteína', '[\"180g filete pescado blanco\", \"lechuga\", \"tomate\", \"pepino\", \"zanahoria\", \"limón\", \"aceite de oliva\"]', '1. Hornea el pescado con limón y hierbas a 180°C por 20 min. 2. Prepara ensalada mixta. 3. Adereza con aceite y limón.', 25, 340, 38, 18, 12, 'easy', 0, 0, 0, '[\"light\", \"omega-3\", \"fresh\"]'),
(13, 'Sopa de lentejas', 'dinner', 'Sopa reconfortante y nutritiva', '[\"200g lentejas cocidas\", \"100g zanahoria\", \"50g apio\", \"100g tomate\", \"cebolla\", \"caldo de verduras\"]', '1. Saltea cebolla, zanahoria y apio. 2. Añade tomate y caldo. 3. Agrega lentejas cocidas. 4. Cocina 15 min. 5. Sazona al gusto.', 30, 320, 22, 54, 2, 'easy', 1, 1, 0, '[\"comfort-food\", \"plant-based\", \"fiber-rich\"]'),
(14, 'Omelette de vegetales', 'dinner', 'Cena rápida y proteica', '[\"3 huevos\", \"50g espinacas\", \"50g champiñones\", \"50g tomate\", \"queso bajo en grasa opcional\"]', '1. Bate los huevos. 2. Saltea los vegetales. 3. Vierte los huevos sobre los vegetales. 4. Cocina hasta que cuaje. 5. Dobla por la mitad.', 15, 320, 24, 12, 20, 'easy', 1, 0, 0, '[\"quick\", \"high-protein\", \"low-carb\"]'),
(15, 'Pavo con ensalada grande', 'dinner', 'Cena ligera y satisfactoria', '[\"150g pechuga de pavo\", \"lechuga\", \"tomate\", \"pepino\", \"zanahoria\", \"1/2 aguacate\", \"vinagreta\"]', '1. Cocina el pavo a la plancha con especias. 2. Prepara una ensalada grande con todos los vegetales. 3. Corta el pavo en tiras. 4. Coloca sobre la ensalada. 5. Adereza con vinagreta.', 20, 380, 44, 22, 18, 'easy', 0, 0, 0, '[\"light-dinner\", \"high-protein\", \"fresh\"]'),
(16, 'Manzana con mantequilla de maní', 'snack', 'Snack energético y saciante', '[\"1 manzana\", \"2 cucharadas mantequilla de maní\"]', '1. Corta la manzana en rodajas. 2. Unta cada rodaja con mantequilla de maní.', 3, 220, 6, 32, 10, 'easy', 1, 0, 0, '[\"quick\", \"energizing\", \"no-cook\"]'),
(17, 'Yogurt con nueces', 'snack', 'Snack proteico y crujiente', '[\"150g yogurt griego\", \"30g nueces\", \"1 cucharadita miel\"]', '1. Sirve el yogurt en un bowl. 2. Añade nueces picadas. 3. Decora con miel.', 2, 230, 14, 18, 14, 'easy', 1, 0, 0, '[\"high-protein\", \"no-cook\", \"quick\"]'),
(18, 'Hummus con vegetales', 'snack', 'Snack saludable y colorido', '[\"100g hummus\", \"zanahoria\", \"apio\", \"pimiento\", \"pepino\"]', '1. Coloca el hummus en el centro de un plato. 2. Corta todos los vegetales en palitos. 3. Acomoda alrededor del hummus.', 5, 180, 8, 24, 8, 'easy', 1, 1, 0, '[\"vegan\", \"colorful\", \"fiber-rich\"]'),
(19, 'Batido de proteína', 'snack', 'Snack post-entrenamiento', '[\"1 scoop proteína en polvo\", \"250ml agua o leche\", \"1/2 plátano\", \"hielo\"]', '1. Coloca todos los ingredientes en licuadora. 2. Licúa hasta obtener consistencia suave. 3. Sirve inmediatamente.', 3, 200, 24, 22, 2, 'easy', 1, 0, 0, '[\"post-workout\", \"quick\", \"high-protein\"]'),
(20, 'Mix de frutos secos', 'snack', 'Snack portátil y energético', '[\"15g almendras\", \"15g nueces\", \"15g pasas\"]', '1. Mezcla todos los ingredientes en una bolsa pequeña. 2. Listo para llevar.', 1, 200, 6, 18, 14, 'easy', 1, 1, 0, '[\"portable\", \"energizing\", \"no-cook\"]'),
(21, 'Rollitos de pavo y queso', 'snack', 'Snack proteico bajo en carbos', '[\"3 lonjas pavo\", \"30g queso bajo en grasa\", \"lechuga\"]', '1. Coloca una hoja de lechuga sobre cada lonja de pavo. 2. Añade una tira de queso. 3. Enrolla y asegura con palillo.', 5, 150, 20, 4, 6, 'easy', 0, 0, 0, '[\"low-carb\", \"high-protein\", \"keto-friendly\"]'),
(22, 'Tostada con aguacate', 'snack', 'Snack con grasas saludables', '[\"1 rebanada pan integral\", \"1/4 aguacate\", \"sal y pimienta\", \"tomate cherry\"]', '1. Tuesta el pan. 2. Machaca el aguacate con sal y pimienta. 3. Unta en el pan. 4. Decora con tomates.', 5, 180, 6, 20, 10, 'easy', 1, 1, 0, '[\"healthy-fats\", \"quick\", \"filling\"]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `level` int(11) DEFAULT 1,
  `total_points` int(11) DEFAULT 0,
  `current_streak` int(11) DEFAULT 0,
  `longest_streak` int(11) DEFAULT 0,
  `total_habits_completed` int(11) DEFAULT 0,
  `total_exercise_minutes` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_achievements`
--

CREATE TABLE `user_achievements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `achievement_id` int(11) NOT NULL,
  `unlocked_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_avatar_config`
--

CREATE TABLE `user_avatar_config` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sex` varchar(20) DEFAULT 'man',
  `face_color` varchar(20) DEFAULT '#F9C9B6',
  `ear_size` varchar(20) DEFAULT 'small',
  `hair_style` varchar(50) DEFAULT 'normal',
  `hair_color` varchar(20) DEFAULT '#000',
  `hat_style` varchar(50) DEFAULT 'none',
  `eye_style` varchar(50) DEFAULT 'circle',
  `glasses_style` varchar(50) DEFAULT 'none',
  `nose_style` varchar(50) DEFAULT 'short',
  `mouth_style` varchar(50) DEFAULT 'smile',
  `shirt_style` varchar(50) DEFAULT 'hoody',
  `shirt_color` varchar(20) DEFAULT '#77311D',
  `bg_color` varchar(20) DEFAULT '#E0DDFF',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_habits`
--

CREATE TABLE `user_habits` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `habit_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `custom_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_profile`
--

CREATE TABLE `user_profile` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `goal` enum('lose_weight','gain_muscle','maintain','improve_health') DEFAULT 'improve_health',
  `activity_level` enum('sedentary','light','moderate','active','very_active') DEFAULT 'moderate',
  `dietary_preference` enum('none','vegetarian','vegan','pescatarian','keto','paleo') DEFAULT 'none',
  `allergies` text DEFAULT NULL,
  `health_conditions` text DEFAULT NULL,
  `daily_calories_target` int(11) DEFAULT NULL,
  `protein_target` int(11) DEFAULT NULL,
  `carbs_target` int(11) DEFAULT NULL,
  `fat_target` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_stats`
--

CREATE TABLE `user_stats` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `total_exercise_minutes` int(11) DEFAULT 0,
  `estimated_calories` int(11) DEFAULT 0,
  `water_glasses` int(11) DEFAULT 0,
  `sleep_hours` decimal(3,1) DEFAULT 0.0,
  `meditation_minutes` int(11) DEFAULT 0,
  `habits_completed_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `favorite_recipes`
--
ALTER TABLE `favorite_recipes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_recipe` (`user_id`,`recipe_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indices de la tabla `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`);

--
-- Indices de la tabla `habits`
--
ALTER TABLE `habits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category_id`);

--
-- Indices de la tabla `habit_categories`
--
ALTER TABLE `habit_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `habit_completions`
--
ALTER TABLE `habit_completions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_date` (`user_id`,`completed_at`),
  ADD KEY `idx_habit_date` (`habit_id`,`completed_at`);

--
-- Indices de la tabla `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_meal_type` (`meal_type`),
  ADD KEY `idx_calories` (`total_calories`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_username` (`username`);

--
-- Indices de la tabla `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_achievement` (`user_id`,`achievement_id`),
  ADD KEY `achievement_id` (`achievement_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indices de la tabla `user_avatar_config`
--
ALTER TABLE `user_avatar_config`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indices de la tabla `user_habits`
--
ALTER TABLE `user_habits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_habit` (`user_id`,`habit_id`),
  ADD KEY `habit_id` (`habit_id`),
  ADD KEY `idx_user_active` (`user_id`,`is_active`);

--
-- Indices de la tabla `user_profile`
--
ALTER TABLE `user_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indices de la tabla `user_stats`
--
ALTER TABLE `user_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_date` (`user_id`,`date`),
  ADD KEY `idx_user_date` (`user_id`,`date`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `favorite_recipes`
--
ALTER TABLE `favorite_recipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `foods`
--
ALTER TABLE `foods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `habits`
--
ALTER TABLE `habits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `habit_categories`
--
ALTER TABLE `habit_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `habit_completions`
--
ALTER TABLE `habit_completions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_avatar_config`
--
ALTER TABLE `user_avatar_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_habits`
--
ALTER TABLE `user_habits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_profile`
--
ALTER TABLE `user_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_stats`
--
ALTER TABLE `user_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `favorite_recipes`
--
ALTER TABLE `favorite_recipes`
  ADD CONSTRAINT `favorite_recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorite_recipes_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `habits`
--
ALTER TABLE `habits`
  ADD CONSTRAINT `habits_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `habit_categories` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `habit_completions`
--
ALTER TABLE `habit_completions`
  ADD CONSTRAINT `habit_completions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `habit_completions_ibfk_2` FOREIGN KEY (`habit_id`) REFERENCES `habits` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_avatar_config`
--
ALTER TABLE `user_avatar_config`
  ADD CONSTRAINT `user_avatar_config_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_habits`
--
ALTER TABLE `user_habits`
  ADD CONSTRAINT `user_habits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_habits_ibfk_2` FOREIGN KEY (`habit_id`) REFERENCES `habits` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_profile`
--
ALTER TABLE `user_profile`
  ADD CONSTRAINT `user_profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_stats`
--
ALTER TABLE `user_stats`
  ADD CONSTRAINT `user_stats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
