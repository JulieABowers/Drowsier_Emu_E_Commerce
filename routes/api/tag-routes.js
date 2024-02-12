const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      attributes: [
        'id',
        'tag_name',
    ],
    include: [
      {
        model: Product,
        as: 'tags', 
        through: ProductTag,
        attributes: ['id', 'product_name', 'price', 'stock'],
      }
    ]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ message: "Unable to find Tags.  " + err });
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      attributes: [
        'id',
        'tag_name',
      ],
      include: [
        {
          model: Product,
          as: 'tags', 
          through: ProductTag,
          attributes: ['id', 'product_name', 'price', 'stock'],
        }
      ],
    });
  
    if (!tagData) {
      res.status(404).json({ message: 'Tag not found!' });
      return;
    }
  
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create({tag_name: req.body.tag_name});
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json({ message: 'Unable to add tag.  ' + err });
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    // Update the tag's name by its `id` value
    const tagData = await Tag.update(
      {
        tag_name: req.body.tag_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    );

    // Check if any rows were updated
    if (tagData === 0) {
      return res.status(404).json({ message: 'No Tag found with this id.' });
    }

    // Respond with the updated data
    res.json({ message: 'Tag updated successfully.' });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json(err);
  }

});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ message: 'Unable to find tag.  ' + err });
  }
});

module.exports = router;
