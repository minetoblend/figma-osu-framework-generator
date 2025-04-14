export enum Anchor {
  /// <summary>
  /// The vertical counterpart is at "Top" position.
  /// </summary>
  y0 = 1,

  /// <summary>
  /// The vertical counterpart is at "Centre" position.
  /// </summary>
  y1 = 1 << 1,

  /// <summary>
  /// The vertical counterpart is at "Bottom" position.
  /// </summary>
  y2 = 1 << 2,

  /// <summary>
  /// The horizontal counterpart is at "Left" position.
  /// </summary>
  x0 = 1 << 3,

  /// <summary>
  /// The horizontal counterpart is at "Centre" position.
  /// </summary>
  x1 = 1 << 4,

  /// <summary>
  /// The horizontal counterpart is at "Right" position.
  /// </summary>
  x2 = 1 << 5,

  /// <summary>
  /// The user is manually updating the outcome, so we shouldn't.
  /// </summary>
  Custom = 1 << 6,
  TopLeft = y0 | x0,
  TopCentre = y0 | x1,
  TopRight = y0 | x2,

  CentreLeft = y1 | x0,
  Centre = y1 | x1,
  CentreRight = y1 | x2,

  BottomLeft = y2 | x0,
  BottomCentre = y2 | x1,
  BottomRight = y2 | x2,
}