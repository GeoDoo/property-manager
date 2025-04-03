-- Add 40 properties with realistic data
INSERT INTO properties (address, description, price, bedrooms, bathrooms, square_footage)
VALUES
    -- London Properties
    ('1 Kensington Gardens, London W8 4PX', 'Modern apartment in the heart of London''s shopping district', 2500000.00, 5, 4, 2000),
    ('15 Chelsea Harbour, London SW10 0XG', 'Spacious townhouse with garden', 1800000.00, 3, 2, 1500),
    ('22 Notting Hill Gate, London W11 3JE', 'Recently renovated Victorian property', 3200000.00, 6, 4, 2500),
    ('8 Canary Wharf, London E14 5AB', 'Historic flat with castle views', 2200000.00, 4, 3, 1800),
    ('12 Hampstead Heath, London NW3 1AB', 'Period conversion with high ceilings', 2800000.00, 5, 3, 2000),

    -- Manchester Properties
    ('25 Deansgate, Manchester M3 4LQ', 'Modern apartment in the heart of London''s shopping district', 450000.00, 2, 2, 1000),
    ('8 Didsbury Park, Manchester M20 5LH', 'Spacious townhouse with garden', 550000.00, 4, 2, 1500),
    ('15 Castlefield, Manchester M15 4LZ', 'Recently renovated Victorian property', 400000.00, 2, 1, 800),
    ('22 Chorlton Green, Manchester M21 9HS', 'Charming old town property', 475000.00, 3, 2, 1200),
    ('5 Altrincham Road, Manchester M22 4DB', 'Modern high-rise apartment', 600000.00, 5, 3, 1800),

    -- Birmingham Properties
    ('10 Edgbaston, Birmingham B15 2TR', 'Family home with garden', 750000.00, 4, 3, 2000),
    ('25 Mailbox, Birmingham B1 1RF', 'Contemporary city centre apartment', 450000.00, 2, 2, 1000),
    ('8 Moseley, Birmingham B13 8JP', 'Period features throughout', 550000.00, 3, 2, 1200),
    ('15 Sutton Coldfield, Birmingham B73 6AA', 'Historic building conversion', 650000.00, 4, 3, 1800),
    ('22 Harborne, Birmingham B17 9AA', 'Urban living apartment', 600000.00, 4, 2, 1500),

    -- Edinburgh Properties
    ('1 New Town, Edinburgh EH2 2AD', 'Charming old town property', 1200000.00, 5, 3, 2000),
    ('15 Stockbridge, Edinburgh EH3 6AA', 'Georgian townhouse', 450000.00, 2, 1, 800),
    ('8 Morningside, Edinburgh EH10 4AA', 'Modern build with amenities', 650000.00, 4, 2, 1200),
    ('22 Marchmont, Edinburgh EH9 1AA', 'Historic flat with castle views', 400000.00, 2, 2, 1000),
    ('5 Bruntsfield, Edinburgh EH10 4AA', 'Modern high-rise apartment', 750000.00, 4, 3, 1800),

    -- Bristol Properties
    ('10 Clifton, Bristol BS8 4AA', 'Waterfront development', 850000.00, 4, 3, 2000),
    ('25 Redland, Bristol BS6 6AA', 'Period features throughout', 550000.00, 3, 2, 1200),
    ('8 Hotwells, Bristol BS8 4AA', 'Contemporary city centre apartment', 450000.00, 2, 2, 1000),
    ('15 Bishopston, Bristol BS7 8AA', 'Urban living apartment', 600000.00, 4, 2, 1500),
    ('22 Cotham, Bristol BS6 6AA', 'Converted warehouse apartment', 650000.00, 4, 3, 1800),

    -- Leeds Properties
    ('1 Roundhay, Leeds LS8 2AA', 'Modern apartment in the heart of London''s shopping district', 750000.00, 5, 3, 2000),
    ('15 Headingley, Leeds LS6 3AA', 'Spacious city apartment', 450000.00, 3, 2, 1200),
    ('8 Chapel Allerton, Leeds LS7 4AA', 'Period features throughout', 350000.00, 2, 1, 800),
    ('22 Horsforth, Leeds LS18 5AA', 'Urban living apartment', 600000.00, 4, 3, 1800),
    ('5 Meanwood, Leeds LS7 2AA', 'Modern high-rise apartment', 500000.00, 3, 2, 1000),

    -- Glasgow Properties
    ('10 West End, Glasgow G12 8AA', 'Waterfront development', 650000.00, 4, 3, 1800),
    ('25 Merchant City, Glasgow G1 1AA', 'Modern apartment in the heart of London''s shopping district', 350000.00, 2, 2, 1000),
    ('8 Hyndland, Glasgow G12 9AA', 'Period features throughout', 550000.00, 3, 2, 1200),
    ('15 Shawlands, Glasgow G41 3AA', 'Modern high-rise apartment', 450000.00, 4, 2, 1500),
    ('22 Bearsden, Glasgow G61 2AA', 'Modern build with amenities', 750000.00, 5, 3, 2000),

    -- Liverpool Properties
    ('1 Sefton Park, Liverpool L17 1AA', 'Waterfront development', 850000.00, 6, 4, 2500),
    ('15 Albert Dock, Liverpool L1 1AA', 'Period features throughout', 450000.00, 2, 2, 1000),
    ('8 Woolton, Liverpool L25 5AA', 'Urban living apartment', 550000.00, 4, 3, 1800),
    ('22 Allerton, Liverpool L18 1AA', 'Modern high-rise apartment', 600000.00, 4, 3, 1800),
    ('5 Crosby, Liverpool L23 0AA', 'Converted warehouse apartment', 700000.00, 5, 3, 2000),

    -- Additional properties
    ('123 Oxford Street, London W1D 2JD', 'Modern apartment in the heart of London''s shopping district', 750000, 2, 1, 850),
    ('45 King Street, Manchester M2 6DB', 'Spacious townhouse with garden', 450000, 3, 2, 1200),
    ('67 New Street, Birmingham B2 4DU', 'Recently renovated Victorian property', 350000, 4, 2, 1500),
    ('89 Princes Street, Edinburgh EH2 2ER', 'Historic flat with castle views', 400000, 2, 1, 800),
    ('12 Park Row, Bristol BS1 5LF', 'Contemporary city centre apartment', 325000, 2, 2, 900),
    ('34 The Headrow, Leeds LS1 8EQ', 'Modern penthouse with skyline views', 375000, 3, 2, 1100),
    ('56 Buchanan Street, Glasgow G1 3JX', 'Traditional tenement flat', 280000, 2, 1, 750),
    ('78 Bold Street, Liverpool L1 4EA', 'Converted warehouse apartment', 295000, 2, 1, 850),
    ('234 Baker Street, London NW1 6XE', 'Period conversion with high ceilings', 850000, 3, 2, 1300),
    ('90 Deansgate, Manchester M3 2GP', 'Luxury city apartment', 475000, 2, 2, 950),
    ('123 Corporation Street, Birmingham B4 6RN', 'Family home with garden', 425000, 4, 3, 1800),
    ('45 Royal Mile, Edinburgh EH1 1SR', 'Charming old town property', 450000, 3, 1, 1000),
    ('67 Queen Square, Bristol BS1 4JP', 'Georgian townhouse', 550000, 4, 3, 2000),
    ('89 Briggate, Leeds LS1 6LQ', 'Modern development apartment', 285000, 2, 1, 800),
    ('12 Sauchiehall Street, Glasgow G2 3DH', 'Renovated city flat', 260000, 2, 1, 750),
    ('34 Castle Street, Liverpool L2 0NR', 'Dockside apartment with river views', 320000, 2, 2, 900),
    ('567 Kings Road, London SW6 2EB', 'Chelsea riverside apartment', 925000, 3, 2, 1400),
    ('123 Portland Street, Manchester M1 4QD', 'Contemporary city living', 395000, 2, 1, 850),
    ('456 Broad Street, Birmingham B1 2JP', 'Modern high-rise apartment', 375000, 2, 2, 950),
    ('789 George Street, Edinburgh EH2 3ES', 'Elegant New Town property', 475000, 3, 2, 1200),
    ('101 Park Street, Bristol BS1 5PB', 'Period features throughout', 445000, 3, 2, 1300),
    ('202 Albion Street, Leeds LS2 8DT', 'Converted mill apartment', 265000, 2, 1, 800),
    ('303 Bath Street, Glasgow G2 4JR', 'West End apartment', 295000, 2, 1, 850),
    ('404 Dale Street, Liverpool L2 2DW', 'City centre conversion', 275000, 2, 1, 800),
    ('789 Marylebone Road, London NW1 5QE', 'Luxury development apartment', 875000, 2, 2, 1100),
    ('234 Piccadilly, Manchester M1 2BN', 'Historic building conversion', 425000, 3, 2, 1200),
    ('567 Colmore Row, Birmingham B3 2BJ', 'Professional district apartment', 345000, 2, 1, 850),
    ('890 Queen Street, Edinburgh EH2 1JQ', 'Modern development with parking', 385000, 2, 2, 900),
    ('123 Corn Street, Bristol BS1 1HT', 'Character property in Old City', 395000, 3, 2, 1100),
    ('456 Call Lane, Leeds LS1 7BR', 'Urban living apartment', 255000, 2, 1, 750),
    ('789 Hope Street, Glasgow G2 6AB', 'Spacious city apartment', 275000, 2, 1, 850),
    ('101 Water Street, Liverpool L2 0RG', 'Waterfront development', 345000, 2, 2, 950),
    ('202 Sloane Street, London SW1X 9QX', 'Luxury Knightsbridge apartment', 1250000, 3, 2, 1600),
    ('303 Oxford Road, Manchester M13 9PL', 'University quarter apartment', 325000, 2, 1, 800),
    ('404 Suffolk Street, Birmingham B1 1LT', 'City core apartment', 295000, 2, 1, 850),
    ('505 Lothian Road, Edinburgh EH3 9BE', 'Modern build with amenities', 365000, 2, 2, 900),
    ('606 Baldwin Street, Bristol BS1 1QB', 'Harbourside apartment', 375000, 2, 2, 950),
    ('707 Wellington Street, Leeds LS1 4LT', 'Contemporary city living', 285000, 2, 1, 800),
    ('808 Argyle Street, Glasgow G3 8LZ', 'River Clyde views', 315000, 2, 2, 900),
    ('909 Church Street, Liverpool L1 3DD', 'Central location apartment', 265000, 2, 1, 750); 