# How can I find genes in a region using chromosome coordinates?
<!-- pombase_categories: Querying/Searching -->

To find genes within a given set of chromosome coordinates, you must
perform a complex query in the [Advanced Search](/spombe/query/)to
specify which chromosome you want, and what coordinates. You can do the
queries separately and then combine them, or set up a single query. In
either case, first go to the Advanced Search page (
<http://www.pombase.org/spombe/query>).

To query by separate steps:

1.  Select the 'Genes Between Chromosome Coordinates' filter. Enter your
    start and end coordinates, and click 'Submit'.
2.  Click the 'New Query' tab (in the horizontal list just under the
    page header).
3.  Select the 'Genes On Chromosome...' filter. Choose a chromosome from
    the pulldown. Click 'Submit'
4.  Click the 'Query Management' tab.
5.  Select your last two queries by checking the boxes on the left.
6.  Click 'Join (AND)' to find genes that match both sets of criteria.

(You can do the chromosome and coordinate queries in either order; it
makes no difference.)

To do a single query:

1.  Select the 'Genes Between Chromosome Coordinates' filter. Enter your
    start and end coordinates.
2.  Click '+' to add another query parameter. Leave the 'Operator'
    pulldown on the left set to 'AND' (the default).
3.  Select the 'Genes On Chromosome...' filter. Choose a chromosome from
    the pulldown. Click 'Submit' to execute the entire query.

See the [Advanced Search
documentation](/documentation/advanced-search-documentation)for more
information on setting up complex queries.

To find all features (not only genes), use the Genome Browser [as
described
here](/faqs/how-can-i-retrieve-sequence-region-using-sequence-coordinates).

Example query: [Genes between coordinates 1000000-2000000 on chromosome
2](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%2210%22,%22query%22:%22II%22%7D,%22filter_2%22:%7B%22operator%22:%22AND%22,%22filter%22:%2215%22,%22query_1%22:%221000000%22,%22query_2%22:%222000000%22%7D%7D,%22filter_count%22:%222%22%7D%5D)

