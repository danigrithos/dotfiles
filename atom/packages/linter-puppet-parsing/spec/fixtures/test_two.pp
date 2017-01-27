#regression test for no errors situation
file { '/no/errors/here':
  ensure => file,
  mode   => '1234',
}
