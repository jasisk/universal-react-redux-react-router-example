export default function(req, res) {
  res.status(201).send({message: 'sentiment conveyed'});
  return;
    res.format({
      json: () => res.status(201).send({message: 'sentiment conveyed'}),
      html: () => res.redirect('/'),
      default: () => res.status(201).send('sentiment conveyed')
    });
};
