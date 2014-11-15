use strict;
use warnings;
use JSON;
use Data::Dumper;
use Text::Levenshtein::Damerau;

use List::MoreUtils qw(firstidx);

use Scalar::Util 'looks_like_number';

# make a matcher
sub matcher {
	my $word = shift;
	my $targets = shift;

	my $lev = Text::Levenshtein::Damerau->new($word);

	my $best_match = $lev->dld_best_match( {list => $targets} );

	( $best_match, $lev->dld({list => $targets})->{$best_match} );
}


sub numify {
	my $num = shift;

	ref $num and die "cannot numify non-simple scalar";

	if (looks_like_number($num)) {
		return 0+$num;
	}

	my $no_comma = do {
		my $t = "$num";
		$t =~ s/\,//g;
		$t;
	};

	if (looks_like_number($no_comma)) {
		return 0+$no_comma;
	}
	# isn't a number I guess
	return $num;
}

numify("3,456") == 3456 or die;


sub numify_values {
	my $hashref = shift;
	my %out;
	while (my ($key, $value) = each %$hashref) {
		$out{$key} = numify($value);
	}

	return \%out;
}






sub name_before_paren {
	my $word = shift;
	my $t = "$word";
	$t =~ s/\(.*\)//;
	return trim($t);
}

sub merge_hashes {
	my $hashes = shift;
	my %out;

	foreach my $hash (@$hashes) {
		while (my ($key, $value) = each %$hash) {
			if ($key ne "") {
				die "cannot merge non-unique key : $key" if exists $out{$key};
				$out{$key} = $value;
			}
		}
	}

	return \%out;
}

sub matrixey {
	my $all_hashrefs = shift;

	my %all_keys;
	
	for my $hashref (@$all_hashrefs) {
		for my $key (keys %$hashref) {
			$all_keys{$key} = 1;
		}
	}

	my @keys = sort keys %all_keys;

	my @out = [@keys];

	for my $hashref (@$all_hashrefs) {
		my $el = [];

		while (my ($idx, $key) = each @keys) {
			$el->[$idx] = $hashref->{$key};
		}

		push @out, $el;
	}

	return \@out;
}

my $json = JSON->new;
my $utf8 =  "<:encoding(UTF-8)";

sub trim { my $s = shift; $s =~ s/^\s+|\s+$//g; return $s };

open (my $players, $utf8, "playerjson.txt") or die;

open (my $projections, $utf8, "expertProjections.txt") or die;

my ($playerInfo, $projectionInfo);

{
	local $/ = undef;

	$playerInfo = $json->decode(scalar <$players>);
	$projectionInfo = $json->decode(scalar <$projections>);

}

my %name_to_record;

foreach my $row (@$playerInfo) {
	my $field = lc trim(name_before_paren( $row->{Player} ));
	unless (defined $field) {
		print Dumper $row;
		die;
	}
	$name_to_record{ $field } = [$row];
}

foreach my $row (@$projectionInfo) {

	my $field = lc trim($row->{' Player Name '});

	defined $field or die "no field ' Player Name '";

	exists $name_to_record{ $field } or do {

		my ($best, $score) = ( matcher($field, [keys %name_to_record]) );

		if ($score <= 1) {
			print "$field --> $best\n";
			$field = $best;
		} else {

			print "$field is an ignored player\n";
		}
	};

	push @{ $name_to_record{ $field } }, $row;

}

open (my $fh, ">", "combined.txt");

# normalize name_to_record

my %combined_name;
my @combined_name;

while (my ($key, $value) = each %name_to_record) {
	$combined_name{$key} = numify_values( merge_hashes($value) );

	$combined_name{$key}{id} = $key;

	push @combined_name, $combined_name{$key};
}




print Dumper [@combined_name];


print $fh $json->encode([@combined_name]);




