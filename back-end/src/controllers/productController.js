import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Private/Admin
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Private/Admin
 */
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { name, category, costPrice, sellingPrice } = req.body;

  try {
    // Check if product with same name exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // Case insensitive search
        },
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        costPrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
      },
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { name, category, costPrice, sellingPrice } = req.body;

    // Check if product exists
    const productExists = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If name is being changed, check it's not already in use
    if (name && name !== productExists.name) {
      const nameExists = await prisma.product.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
          NOT: {
            id: req.params.id,
          },
        },
      });

      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: "Product with this name already exists",
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (costPrice !== undefined) updateData.costPrice = parseFloat(costPrice);
    if (sellingPrice !== undefined)
      updateData.sellingPrice = parseFloat(sellingPrice);

    const updatedProduct = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Product successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Private/Admin
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: req.params.category,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/**
 * @desc    Get product stats
 * @route   GET /api/products/stats
 * @access  Private/Admin
 */
export const getProductStats = async (req, res) => {
  try {
    // Get total products and average prices
    const basicStats = await prisma.product.aggregate({
      _count: {
        _all: true,
      },
      _avg: {
        costPrice: true,
        sellingPrice: true,
      },
    });

    // Get products by category
    const categoryStats = await prisma.product.groupBy({
      by: ["category"],
      _count: {
        _all: true,
      },
      _avg: {
        sellingPrice: true,
      },
    });

    // Get price range distribution
    const priceRanges = await prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN "sellingPrice" < 1000 THEN 'Under 1000'
          WHEN "sellingPrice" < 5000 THEN '1000-5000'
          WHEN "sellingPrice" < 10000 THEN '5000-10000'
          ELSE 'Over 10000'
        END as price_range,
        COUNT(*) as product_count
      FROM "Product"
      GROUP BY price_range
      ORDER BY price_range;
    `;

    res.status(200).json({
      success: true,
      data: {
        totalProducts: basicStats._count._all,
        averageCostPrice: basicStats._avg.costPrice,
        averageSellingPrice: basicStats._avg.sellingPrice,
        categoryStats,
        priceRanges,
      },
    });
  } catch (error) {
    console.error("Error fetching product statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product statistics",
      error: error.message,
    });
  }
};
